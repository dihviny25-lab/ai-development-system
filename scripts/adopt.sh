#!/usr/bin/env bash
# Copy the AI Development System core into an existing repository, incrementally.
#
# Dry-run by default. Never overwrites existing files. See docs/ADOPTION.md.

set -euo pipefail

usage() {
  cat <<'USAGE'
Usage: scripts/adopt.sh [options] TARGET_DIR

Copies AI Development System files into TARGET_DIR for an adoption level
(docs/ADOPTION.md). Levels are cumulative. Existing files are never
overwritten; differing files are reported so you can merge them by hand.

Options:
  --level N         Adoption level 1-5 (default: 1)
                      1 Guardrails: AGENTS.md, Definition of Done, PR template
                      2 Context:    + PRODUCT/ARCHITECTURE/DECISIONS templates
                      3 Workflow:   + protocol, quality, risk profiles, commands,
                                      issue templates, evidence templates
                      4 Specialists: + agents/ contracts, Claude Code commands
                      5 Delivery:   same files as 4 (delivery work is
                                      project-specific; see docs/ADOPTION.md)
  --profile NAME    Also copy profiles/NAME.md (repeatable)
  --adapters        Also copy client adapters (CLAUDE.md, Cursor, Copilot)
  --apply           Write files. Without it, only prints the plan.
  -h, --help        Show this help
USAGE
}

SOURCE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
level=1
apply=false
adapters=false
profiles=()
target=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --level)
      [[ $# -ge 2 ]] || { echo "error: --level needs a value" >&2; exit 2; }
      level="$2"; shift 2 ;;
    --profile)
      [[ $# -ge 2 ]] || { echo "error: --profile needs a value" >&2; exit 2; }
      profiles+=("$2"); shift 2 ;;
    --adapters) adapters=true; shift ;;
    --apply) apply=true; shift ;;
    -h|--help) usage; exit 0 ;;
    -*) echo "error: unknown option: $1" >&2; usage >&2; exit 2 ;;
    *)
      [[ -z "$target" ]] || { echo "error: only one TARGET_DIR allowed" >&2; exit 2; }
      target="$1"; shift ;;
  esac
done

[[ -n "$target" ]] || { usage >&2; exit 2; }
[[ "$level" =~ ^[1-5]$ ]] || { echo "error: --level must be 1-5" >&2; exit 2; }
[[ -d "$target" ]] || { echo "error: target is not a directory: $target" >&2; exit 2; }
target="$(cd "$target" && pwd)"
[[ "$target" != "$SOURCE" ]] || { echo "error: target is the system repository itself" >&2; exit 2; }

# Each entry is "source-path:destination-path", relative to SOURCE and target.
files=(
  "AGENTS.md:AGENTS.md"
  "docs/DEFINITION_OF_DONE.md:docs/DEFINITION_OF_DONE.md"
  ".github/PULL_REQUEST_TEMPLATE.md:.github/PULL_REQUEST_TEMPLATE.md"
)
if (( level >= 2 )); then
  files+=(
    "docs/PRODUCT.md:docs/PRODUCT.md"
    "docs/ARCHITECTURE.md:docs/ARCHITECTURE.md"
    "docs/DECISIONS.md:docs/DECISIONS.md"
  )
fi
if (( level >= 3 )); then
  files+=(
    "docs/PROTOCOL.md:docs/PROTOCOL.md"
    "docs/QUALITY.md:docs/QUALITY.md"
    "docs/V2.md:docs/V2.md"
    "commands/README.md:commands/README.md"
    ".github/ISSUE_TEMPLATE/feature.md:.github/ISSUE_TEMPLATE/feature.md"
    ".github/ISSUE_TEMPLATE/bug.md:.github/ISSUE_TEMPLATE/bug.md"
  )
  for f in "$SOURCE"/templates/*.md; do
    files+=("templates/$(basename "$f"):templates/$(basename "$f")")
  done
fi
if (( level >= 4 )); then
  for f in "$SOURCE"/agents/*.md; do
    files+=("agents/$(basename "$f"):agents/$(basename "$f")")
  done
  for f in "$SOURCE"/.claude/commands/*.md; do
    files+=(".claude/commands/$(basename "$f"):.claude/commands/$(basename "$f")")
  done
fi
for name in ${profiles[@]+"${profiles[@]}"}; do
  if [[ ! "$name" =~ ^[a-z0-9-]+$ || ! -f "$SOURCE/profiles/$name.md" ]]; then
    echo "error: unknown profile: $name (see profiles/README.md)" >&2
    exit 2
  fi
  files+=("profiles/$name.md:profiles/$name.md")
done
if $adapters; then
  files+=(
    "CLAUDE.md:CLAUDE.md"
    "adapters/cursor/ai-development-system.mdc:.cursor/rules/ai-development-system.mdc"
    "adapters/copilot/copilot-instructions.md:.github/copilot-instructions.md"
  )
fi

$apply && mode="APPLY" || mode="DRY RUN"
echo "AI Development System adoption — level $level — $mode"
echo "Source: $SOURCE"
echo "Target: $target"
echo

created=0; same=0; conflicts=0
for entry in "${files[@]}"; do
  src="$SOURCE/${entry%%:*}"
  dest_rel="${entry#*:}"
  dest="$target/$dest_rel"
  if [[ -e "$dest" ]]; then
    if cmp -s "$src" "$dest"; then
      printf '  same      %s\n' "$dest_rel"; same=$((same + 1))
    else
      printf '  CONFLICT  %s (exists and differs; merge by hand)\n' "$dest_rel"; conflicts=$((conflicts + 1))
    fi
    continue
  fi
  if $apply; then
    mkdir -p "$(dirname "$dest")"
    cp "$src" "$dest"
    printf '  created   %s\n' "$dest_rel"
  else
    printf '  create    %s\n' "$dest_rel"
  fi
  created=$((created + 1))
done

echo
if $apply; then
  echo "Created: $created  Unchanged: $same  Conflicts: $conflicts"
else
  echo "Would create: $created  Unchanged: $same  Conflicts: $conflicts"
  echo "Re-run with --apply to write files."
fi
echo
echo "Next steps (docs/ADOPTION.md):"
echo "  - Replace template content in PRODUCT/ARCHITECTURE docs with observed reality."
echo "  - Wire the repository's real lint/typecheck/test/build scripts into CI."
echo "    This script does not copy .github/workflows: CI must match your stack."
if (( conflicts > 0 )); then
  echo "  - Resolve the CONFLICT files manually; they were left untouched."
fi
if (( level == 5 )); then
  echo "  - Level 5 (delivery/observation) is project work: previews, E2E, observability."
fi
