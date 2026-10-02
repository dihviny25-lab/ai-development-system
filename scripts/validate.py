#!/usr/bin/env python3
"""Validate the AI Development System repository structure and contracts.

Runs the same checks locally and in CI:

    python3 scripts/validate.py

Exits non-zero and prints every problem found.
"""
from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

REQUIRED_FILES = [
    "README.md",
    "AGENTS.md",
    "CLAUDE.md",
    "docs/PROTOCOL.md",
    "docs/QUALITY.md",
    "docs/DEFINITION_OF_DONE.md",
    "docs/PRODUCT.md",
    "docs/ARCHITECTURE.md",
    "docs/DECISIONS.md",
    "docs/V2.md",
    "docs/ADOPTION.md",
    "commands/README.md",
    "agents/orchestrator.md",
    "profiles/README.md",
    "templates/README.md",
    "adapters/README.md",
    ".github/PULL_REQUEST_TEMPLATE.md",
]

SECRET_FILE = re.compile(
    r"(^|/)(\.env|\.env\.(local|production|development)|id_rsa|id_ed25519)$"
)
MD_LINK = re.compile(r"\[[^\]]+\]\(([^)]+)\)")
REPO_PATH = re.compile(
    r"`((?:agents|docs|templates|profiles|commands|adapters|scripts|examples|\.claude)/[\w./-]+)`"
)
COMMAND_HEADING = re.compile(r"^## (?:Composite flow: )?`/([a-z-]+)`", re.MULTILINE)

errors: list[str] = []


def error(check: str, message: str) -> None:
    errors.append(f"[{check}] {message}")


def rel(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def markdown_files() -> list[Path]:
    return sorted(
        p for p in ROOT.rglob("*.md")
        if ".git" not in p.parts and "node_modules" not in p.parts
    )


def check_required_files() -> None:
    for name in REQUIRED_FILES:
        path = ROOT / name
        if not path.is_file() or path.stat().st_size == 0:
            error("required", f"missing or empty: {name}")


def check_secret_files() -> None:
    try:
        tracked = subprocess.run(
            ["git", "ls-files"], cwd=ROOT, check=True, capture_output=True, text=True
        ).stdout.splitlines()
    except (OSError, subprocess.CalledProcessError):
        tracked = [rel(p) for p in ROOT.rglob("*") if p.is_file() and ".git" not in p.parts]
    for name in tracked:
        if SECRET_FILE.search(name):
            error("secrets", f"potential secret-bearing file is tracked: {name}")


def check_markdown_links() -> None:
    for md in markdown_files():
        for target in MD_LINK.findall(md.read_text(encoding="utf-8")):
            if target.startswith(("http://", "https://", "#", "mailto:")):
                continue
            clean = target.split("#", 1)[0]
            if clean and not (md.parent / clean).resolve().exists():
                error("links", f"broken local link: {rel(md)} -> {target}")


def check_repo_path_references(files: list[Path]) -> None:
    for path in files:
        for ref in REPO_PATH.findall(path.read_text(encoding="utf-8")):
            if "*" in ref or "…" in ref:
                continue
            if not (ROOT / ref).exists():
                error("references", f"{rel(path)} references missing path: {ref}")


def check_agents() -> None:
    agents = sorted((ROOT / "agents").glob("*.md"))
    if not agents:
        error("agents", "no agent contracts found in agents/")
    for path in agents:
        text = path.read_text(encoding="utf-8")
        if not text.startswith("# "):
            error("agents", f"{rel(path)} must start with a '# ' title")
        # Some contracts name these sections differently: the shared execution
        # contract uses "Purpose" / "Return schema", the orchestrator
        # "Completion report". A purpose and an output contract are still required.
        if not re.search(r"^## (Mission|Purpose)\s*$", text, re.MULTILINE):
            error("agents", f"{rel(path)} is missing a '## Mission' (or '## Purpose') section")
        if not re.search(r"^## (Output|Completion report|Return schema)\s*$", text, re.MULTILINE):
            error("agents", f"{rel(path)} is missing an '## Output' (or '## Return schema') contract section")
    check_repo_path_references(agents)


def check_commands() -> None:
    readme = (ROOT / "commands/README.md").read_text(encoding="utf-8")
    documented = set(COMMAND_HEADING.findall(readme))
    if not documented:
        error("commands", "no '## `/name`' command headings found in commands/README.md")

    command_dir = ROOT / ".claude/commands"
    files = sorted(command_dir.glob("ads-*.md"))
    implemented = {p.stem.removeprefix("ads-") for p in files}

    for name in sorted(documented - implemented):
        error("commands", f"/{name} is documented but .claude/commands/ads-{name}.md is missing")
    for name in sorted(implemented - documented):
        error("commands", f".claude/commands/ads-{name}.md has no '## `/{name}`' entry in commands/README.md")

    for path in files:
        text = path.read_text(encoding="utf-8")
        match = re.match(r"^---\n(.*?)\n---\n", text, re.DOTALL)
        if not match:
            error("commands", f"{rel(path)} is missing YAML frontmatter")
        elif not re.search(r"^description:\s*\S", match.group(1), re.MULTILINE):
            error("commands", f"{rel(path)} frontmatter needs a non-empty description")
        if "$ARGUMENTS" not in text:
            error("commands", f"{rel(path)} does not use $ARGUMENTS")
    check_repo_path_references(files)


def check_profiles() -> None:
    index = (ROOT / "profiles/README.md").read_text(encoding="utf-8")
    for path in sorted((ROOT / "profiles").glob("*.md")):
        if path.name == "README.md":
            continue
        text = path.read_text(encoding="utf-8")
        if not text.startswith("# Optional Profile: "):
            error("profiles", f"{rel(path)} must start with '# Optional Profile: <stack>'")
        if not re.search(r"^## Typical verification mapping\s*$", text, re.MULTILINE):
            error("profiles", f"{rel(path)} is missing '## Typical verification mapping'")
        if f"({path.name})" not in index:
            error("profiles", f"{rel(path)} is not listed in profiles/README.md")


CHECKS = [
    ("required files", check_required_files),
    ("secret files", check_secret_files),
    ("markdown links", check_markdown_links),
    ("agent contracts", check_agents),
    ("commands", check_commands),
    ("profiles", check_profiles),
]


def main() -> int:
    for label, check in CHECKS:
        before = len(errors)
        check()
        status = "ok" if len(errors) == before else f"{len(errors) - before} problem(s)"
        print(f"{label:<16} {status}")
    if errors:
        print()
        for line in errors:
            print(line)
        return 1
    print("\nAll checks passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
