"""Image card generation using aioEasyPillow."""

import asyncio
import sys
from pathlib import Path
from typing import Any

# Ensure the parent repo is importable
sys.path.insert(0, str(Path(__file__).parent.parent.parent))


def _hex_to_rgb(hex_color: str) -> tuple[int, int, int]:
    hex_color = hex_color.lstrip("#")
    if len(hex_color) == 3:
        hex_color = "".join(c * 2 for c in hex_color)
    r, g, b = int(hex_color[0:2], 16), int(hex_color[2:4], 16), int(hex_color[4:6], 16)
    return r, g, b


def _darken(rgb: tuple[int, int, int], factor: float = 0.5) -> tuple[int, int, int]:
    return tuple(max(0, int(c * factor)) for c in rgb)  # type: ignore


def _lighten(rgb: tuple[int, int, int], factor: float = 1.3) -> tuple[int, int, int]:
    return tuple(min(255, int(c * factor)) for c in rgb)  # type: ignore


async def generate_image_card(
    title: str,
    subtitle: str = "",
    footer: str = "",
    bg_color: str = "#0d1117",
    accent_color: str = "#00bcd4",
    output_filename: str = "jarvis_card.png",
    width: int = 900,
    height: int = 450,
) -> dict[str, Any]:
    """Generate a styled Jarvis-themed image card."""
    try:
        from aioEasyPillow import Canvas, Editor, Font
    except ImportError:
        return {"error": "aioEasyPillow not available. Make sure you are running from the repo root."}

    try:
        # Parse colors
        bg_rgb = _hex_to_rgb(bg_color)
        accent_rgb = _hex_to_rgb(accent_color)
        dark_accent = _darken(accent_rgb, 0.3)
        mid_accent = _darken(accent_rgb, 0.15)

        # --- Canvas ---
        background = Canvas((width, height), color=(*bg_rgb, 255))
        editor = Editor(background)

        # Gradient side panel (left accent stripe)
        stripe_w = 8
        await editor.rectangle((0, 0), width=stripe_w, height=height, fill=(*accent_rgb, 255), radius=0)

        # Subtle inner glow overlay — top strip
        await editor.rectangle(
            (stripe_w, 0), width=width - stripe_w, height=2, fill=(*mid_accent, 60), radius=0
        )
        # Bottom strip
        await editor.rectangle(
            (stripe_w, height - 2), width=width - stripe_w, height=2, fill=(*mid_accent, 60), radius=0
        )

        # Corner accent — top-right
        corner_size = 40
        await editor.rectangle(
            (width - corner_size, 0), width=corner_size, height=2, fill=(*accent_rgb, 180), radius=0
        )
        await editor.rectangle(
            (width - 2, 0), width=2, height=corner_size, fill=(*accent_rgb, 180), radius=0
        )
        # Bottom-left
        await editor.rectangle(
            (stripe_w, height - 2), width=corner_size, height=2, fill=(*accent_rgb, 180), radius=0
        )
        await editor.rectangle(
            (stripe_w, height - corner_size), width=2, height=corner_size, fill=(*accent_rgb, 180), radius=0
        )

        # Decorative horizontal divider
        divider_y = 80
        await editor.rectangle(
            (stripe_w + 20, divider_y),
            width=width - stripe_w - 40,
            height=1,
            fill=(*accent_rgb, 50),
            radius=0,
        )

        # JARVIS label (top-left watermark)
        jarvis_font = Font.poppins(size=13, variant="bold")
        await editor.text(
            (stripe_w + 20, 20),
            text="J.A.R.V.I.S",
            font=jarvis_font,
            color=(*accent_rgb, 200),
        )

        # Subtitle label (top-right corner)
        sub_label_font = Font.poppins(size=11, variant="light")
        await editor.text(
            (width - 130, 22),
            text="INTELLIGENCE SYSTEM",
            font=sub_label_font,
            color=(*accent_rgb, 120),
        )

        # Title
        title_size = max(28, min(56, int(900 / max(len(title), 1))))
        title_font = Font.poppins(size=title_size, variant="bold")
        title_y = height // 2 - (30 if subtitle else 0) - (15 if footer else 0)
        await editor.text(
            (stripe_w + 40, title_y),
            text=title,
            font=title_font,
            color=(255, 255, 255, 240),
        )

        # Subtitle
        if subtitle:
            sub_size = max(16, min(24, int(700 / max(len(subtitle), 1))))
            sub_font = Font.poppins(size=sub_size, variant="regular")
            await editor.text(
                (stripe_w + 42, title_y + title_size + 10),
                text=subtitle,
                font=sub_font,
                color=(*accent_rgb, 210),
            )

        # Footer divider
        if footer:
            footer_divider_y = height - 60
            await editor.rectangle(
                (stripe_w + 20, footer_divider_y),
                width=width - stripe_w - 40,
                height=1,
                fill=(*accent_rgb, 40),
                radius=0,
            )
            footer_font = Font.poppins(size=13, variant="light")
            await editor.text(
                (stripe_w + 40, footer_divider_y + 8),
                text=footer,
                font=footer_font,
                color=(*_darken(accent_rgb, 0.8), 180),
            )

        # Save
        output_path = Path(output_filename)
        await editor.save(output_path, file_format="PNG")

        return {
            "success": True,
            "output_file": str(output_path.resolve()),
            "dimensions": f"{width}x{height}",
            "title": title,
            "subtitle": subtitle,
            "footer": footer,
        }

    except Exception as e:
        return {"error": str(e)}
