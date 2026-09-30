#!/usr/bin/env python3
"""Check that adopting the system never leaves dangling references.

For every adoption level (and with adapters and each profile), run
scripts/adopt.sh into a temporary directory and verify that each repository
path cited in a copied Markdown file exists there. Combinations adopt.sh
refuses (exit 2) must be refused *because* their references would dangle,
so they are skipped rather than counted as failures.

    python3 scripts/check-adoption.py
"""
from __future__ import annotations

import re
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REF = re.compile(
    r"`((?:agents|docs|templates|profiles|commands|adapters|scripts|examples|\.claude)/[\w./-]+)`"
)


def adopt(args: list[str]) -> tuple[Path, subprocess.CompletedProcess[str]]:
    target = Path(tempfile.mkdtemp())
    result = subprocess.run(
        [str(ROOT / "scripts/adopt.sh"), *args, "--apply", str(target)],
        capture_output=True, text=True,
    )
    return target, result


def dangling(target: Path) -> list[str]:
    problems = []
    for path in sorted(target.rglob("*")):
        if not path.is_file() or path.suffix not in (".md", ".mdc"):
            continue
        for ref in sorted(set(REF.findall(path.read_text(encoding="utf-8")))):
            if ref.rstrip("/") != ".claude/commands" and not (target / ref).exists():
                problems.append(f"{path.relative_to(target)} -> {ref}")
    return problems


def main() -> int:
    profiles = sorted(p.stem for p in (ROOT / "profiles").glob("*.md") if p.name != "README.md")
    cases = [["--level", str(n)] for n in range(1, 6)]
    for level in ("1", "3", "4", "5"):
        cases.append(["--level", level, "--adapters"])
        cases += [["--level", level, "--profile", name] for name in profiles]
    cases.append(["--level", "5", "--adapters", *[a for n in profiles for a in ("--profile", n)]])

    failures, checked, refused = 0, 0, 0
    for args in cases:
        target, result = adopt(args)
        label = " ".join(args)
        if result.returncode == 2 and "would not be adopted" in result.stderr:
            refused += 1
            continue
        if result.returncode != 0:
            print(f"FAIL {label}: adopt.sh exited {result.returncode}: {result.stderr.strip()}")
            failures += 1
            continue
        checked += 1
        for problem in dangling(target):
            print(f"FAIL {label}: dangling reference {problem}")
            failures += 1

    # The plain level-1 adoption and the full adoption must always be accepted.
    for args in (["--level", "1"], ["--level", "5", "--adapters"]):
        _, result = adopt(args)
        if result.returncode != 0:
            print(f"FAIL {' '.join(args)}: must be accepted but exited {result.returncode}")
            failures += 1

    print(f"Adoption combinations checked: {checked}, refused as incomplete: {refused}, failures: {failures}")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
