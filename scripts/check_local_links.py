#!/usr/bin/env python3
"""Fail when a production HTML page points to a missing local file."""

from __future__ import annotations

import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


LINK_ATTRIBUTES = {"href", "src", "poster"}
IGNORED_SCHEMES = {"data", "http", "https", "javascript", "mailto", "tel"}


class LinkParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.links: list[str] = []

    def handle_starttag(self, _tag: str, attrs: list[tuple[str, str | None]]) -> None:
        for name, value in attrs:
            if name in LINK_ATTRIBUTES and value:
                self.links.append(value)


def missing_links(page: Path, site_root: Path) -> list[tuple[str, Path]]:
    parser = LinkParser()
    parser.feed(page.read_text(encoding="utf-8"))
    missing: list[tuple[str, Path]] = []

    for raw_link in parser.links:
        parsed = urlsplit(raw_link)
        if parsed.scheme in IGNORED_SCHEMES or not parsed.path:
            continue

        decoded_path = unquote(parsed.path)
        target = site_root / decoded_path.lstrip("/") if decoded_path.startswith("/") else page.parent / decoded_path
        target = target.resolve()

        try:
            target.relative_to(site_root)
        except ValueError:
            missing.append((raw_link, target))
            continue

        if target.is_dir():
            target /= "index.html"
        if not target.is_file():
            missing.append((raw_link, target))

    return missing


def main(arguments: list[str]) -> int:
    site_root = Path.cwd().resolve()
    pages = [Path(argument).resolve() for argument in arguments]
    failures: list[str] = []

    for page in pages:
        if not page.is_file():
            failures.append(f"missing page: {page.relative_to(site_root)}")
            continue
        for raw_link, target in missing_links(page, site_root):
            try:
                display_target = target.relative_to(site_root)
            except ValueError:
                display_target = target
            failures.append(f"{page.relative_to(site_root)}: {raw_link} -> {display_target}")

    if failures:
        print("Broken local links:", file=sys.stderr)
        for failure in failures:
            print(f"- {failure}", file=sys.stderr)
        return 1

    print(f"Validated {len(pages)} production HTML pages.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
