#!/usr/bin/env python3
"""
JARVIS — Just A Rather Very Intelligent System
=============================================
An AI assistant with modern real-world capabilities.

Usage:
    python main.py                  # Interactive CLI
    python main.py --voice          # CLI with voice output
    python main.py --user "Boss"    # Set your name

Environment variables:
    ANTHROPIC_API_KEY   (required) — your Anthropic API key
    JARVIS_MODEL        (optional) — model override (default: claude-sonnet-4-6)
    JARVIS_VOICE        (optional) — 'true' to enable voice by default
    JARVIS_USER         (optional) — your name (default: 'sir')
"""

import argparse
import asyncio
import sys


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="JARVIS AI Assistant",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument("--voice", action="store_true", help="Enable voice output (requires pyttsx3)")
    parser.add_argument("--user", default=None, help="Your name (how JARVIS addresses you)")
    parser.add_argument("--model", default=None, help="Override the Claude model ID")
    parser.add_argument("--no-memory", action="store_true", help="Start without loading previous session")
    parser.add_argument("--version", action="store_true", help="Print version and exit")
    return parser.parse_args()


async def main():
    args = parse_args()

    if args.version:
        from jarvis import __version__
        print(f"JARVIS v{__version__}")
        return

    from jarvis.config import JarvisConfig
    from jarvis.core import Jarvis
    from jarvis.interface.cli import JarvisCLI

    config = JarvisConfig()

    # Apply CLI overrides
    if args.voice:
        config.voice_enabled = True
    if args.user:
        config.user_name = args.user
    if args.model:
        config.model = args.model
    if args.no_memory:
        config.memory_file = ""  # disable persistence

    # Validate
    errors = config.validate()
    if errors:
        for err in errors:
            print(f"ERROR: {err}", file=sys.stderr)
        print(
            "\nPlease set your API key:\n"
            "  export ANTHROPIC_API_KEY='sk-ant-...'",
            file=sys.stderr,
        )
        sys.exit(1)

    jarvis = Jarvis(config)
    cli = JarvisCLI(jarvis)
    await cli.run()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nGoodbye.")
