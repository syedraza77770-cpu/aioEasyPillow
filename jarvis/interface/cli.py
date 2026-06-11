"""Rich terminal CLI interface for JARVIS."""

import asyncio
import sys
import textwrap
from datetime import datetime
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from ..core import Jarvis

try:
    from rich.console import Console
    from rich.markdown import Markdown
    from rich.panel import Panel
    from rich.prompt import Prompt
    from rich.rule import Rule
    from rich.spinner import Spinner
    from rich.status import Status
    from rich.text import Text
    from rich import print as rprint
    _HAS_RICH = True
except ImportError:
    _HAS_RICH = False

_BANNER = r"""
     ██╗ █████╗ ██████╗ ██╗   ██╗██╗███████╗
     ██║██╔══██╗██╔══██╗██║   ██║██║██╔════╝
     ██║███████║██████╔╝██║   ██║██║███████╗
██   ██║██╔══██║██╔══██╗╚██╗ ██╔╝██║╚════██║
╚█████╔╝██║  ██║██║  ██║ ╚████╔╝ ██║███████║
 ╚════╝ ╚═╝  ╚═╝╚═╝  ╚═╝  ╚═══╝  ╚═╝╚══════╝
  Just A Rather Very Intelligent System  v1.0
"""

_HELP_TEXT = """
**Available commands:**

| Command | Description |
|---------|-------------|
| `/help`  | Show this help message |
| `/notes` | List all saved notes |
| `/reminders` | List pending reminders |
| `/clear` | Clear conversation history |
| `/system` | Show system diagnostics |
| `/voice on` / `/voice off` | Toggle voice output |
| `/exit` | Exit JARVIS |

**Tips:**
- Ask anything conversationally — JARVIS uses tools automatically
- "What's the weather in Tokyo?" → live weather data
- "Search for news about AI" → current headlines
- "Calculate factorial(20)" → math result
- "Generate a card with title 'Hello World'" → creates a PNG image
- "Remind me to call Alice on Friday at 9am" → sets a reminder
"""

_COMMANDS = {"/help", "/notes", "/reminders", "/clear", "/system", "/exit", "/quit", "/voice"}


class JarvisCLI:
    def __init__(self, jarvis: "Jarvis"):
        self.jarvis = jarvis
        self.console = Console() if _HAS_RICH else None
        self._voice_engine = None
        self._voice_enabled = jarvis.config.voice_enabled
        if self._voice_enabled:
            self._init_voice()

    # ── Voice ──────────────────────────────────────────────────────────────────

    def _init_voice(self):
        try:
            import pyttsx3  # type: ignore
            self._voice_engine = pyttsx3.init()
            self._voice_engine.setProperty("rate", self.jarvis.config.voice_rate)
            self._voice_engine.setProperty("volume", self.jarvis.config.voice_volume)
            # Try to find a good English voice
            voices = self._voice_engine.getProperty("voices")
            for v in voices:
                if "english" in v.name.lower() or "en" in v.id.lower():
                    self._voice_engine.setProperty("voice", v.id)
                    break
        except ImportError:
            self._print_warning("pyttsx3 not installed — voice disabled. Run: pip install pyttsx3")
            self._voice_enabled = False
        except Exception as e:
            self._print_warning(f"Voice init failed: {e}")
            self._voice_enabled = False

    def _speak(self, text: str):
        if not self._voice_enabled or not self._voice_engine:
            return
        try:
            # Strip markdown before speaking
            import re
            clean = re.sub(r"[#*`|_\[\]()~>]", "", text)
            clean = re.sub(r"\n+", " ", clean).strip()
            self._voice_engine.say(clean[:800])
            self._voice_engine.runAndWait()
        except Exception:
            pass

    # ── Output helpers ─────────────────────────────────────────────────────────

    def _print(self, text: str, style: str = ""):
        if self.console:
            self.console.print(text, style=style)
        else:
            print(text)

    def _print_warning(self, text: str):
        if self.console:
            self.console.print(f"[yellow]⚠ {text}[/yellow]")
        else:
            print(f"WARNING: {text}")

    def _print_error(self, text: str):
        if self.console:
            self.console.print(f"[red]✗ {text}[/red]")
        else:
            print(f"ERROR: {text}")

    def _print_banner(self):
        if self.console:
            self.console.print(_BANNER, style="bold cyan")
            self.console.print(
                f"[dim]Model: {self.jarvis.config.model}  │  "
                f"Memory: {self.jarvis.config.memory_file}  │  "
                f"Type /help for commands[/dim]"
            )
            self.console.print(Rule(style="cyan dim"))
        else:
            print(_BANNER)
            print("Type /help for available commands.\n")

    def _print_jarvis(self, text: str):
        if self.console:
            ts = datetime.now().strftime("%H:%M:%S")
            header = Text()
            header.append("JARVIS", style="bold cyan")
            header.append(f"  {ts}", style="dim")
            self.console.print()
            self.console.print(header)
            self.console.print(Rule(style="cyan dim"))
            try:
                self.console.print(Markdown(text))
            except Exception:
                self.console.print(text)
            self.console.print(Rule(style="cyan dim"))
        else:
            print(f"\nJARVIS:\n{'-'*60}\n{text}\n{'-'*60}\n")

    def _print_tool_use(self, tool_name: str, tool_input: dict):
        if self.console:
            args_preview = ", ".join(
                f"{k}={repr(v)[:40]}" for k, v in tool_input.items()
            )
            self.console.print(
                f"  [yellow]⚙ Using tool:[/yellow] [bold]{tool_name}[/bold]"
                f"[dim]({args_preview})[/dim]"
            )
        else:
            print(f"  [Using tool: {tool_name}]")

    def _print_user(self, text: str):
        if self.console:
            ts = datetime.now().strftime("%H:%M:%S")
            self.console.print(f"\n[bold blue]You[/bold blue] [dim]{ts}[/dim]")
            self.console.print(f"[blue]{text}[/blue]")
        else:
            print(f"\nYou: {text}")

    # ── Built-in commands ─────────────────────────────────────────────────────

    async def _handle_command(self, cmd: str) -> bool:
        """Handle slash commands. Returns True if command was handled."""
        parts = cmd.strip().split()
        base = parts[0].lower()

        if base in ("/exit", "/quit"):
            self._print("\n[bold cyan]JARVIS:[/bold cyan] Powering down. Goodbye, sir.")
            return False  # signal exit

        elif base == "/help":
            if self.console:
                self.console.print(Markdown(_HELP_TEXT))
            else:
                print(_HELP_TEXT)

        elif base == "/clear":
            self.jarvis.clear_memory()
            self._print("[cyan]✓ Conversation history cleared.[/cyan]")

        elif base == "/notes":
            notes = self.jarvis.notes.get_notes()
            if not notes:
                self._print("[dim]No notes saved yet.[/dim]")
            else:
                if self.console:
                    from rich.table import Table
                    table = Table(title="Saved Notes", border_style="cyan")
                    table.add_column("ID", style="cyan", width=4)
                    table.add_column("Title", style="bold")
                    table.add_column("Tags", style="yellow")
                    table.add_column("Created", style="dim")
                    for n in notes:
                        table.add_row(
                            str(n["id"]),
                            n["title"],
                            ", ".join(n.get("tags", [])) or "—",
                            n["created"][:10],
                        )
                    self.console.print(table)
                else:
                    for n in notes:
                        print(f"[{n['id']}] {n['title']}  ({', '.join(n.get('tags',[]) or ['no tags'])})")

        elif base == "/reminders":
            reminders = self.jarvis.notes.get_reminders()
            if not reminders:
                self._print("[dim]No pending reminders.[/dim]")
            else:
                if self.console:
                    from rich.table import Table
                    table = Table(title="Pending Reminders", border_style="yellow")
                    table.add_column("ID", style="cyan", width=4)
                    table.add_column("Title", style="bold")
                    table.add_column("Due", style="yellow")
                    table.add_column("Priority", style="magenta")
                    for r in reminders:
                        table.add_row(
                            str(r["id"]),
                            r["title"],
                            r.get("datetime", "—"),
                            r.get("priority", "medium"),
                        )
                    self.console.print(table)
                else:
                    for r in reminders:
                        print(f"[{r['id']}] {r['title']} — {r.get('datetime','?')} ({r.get('priority','medium')})")

        elif base == "/system":
            from ..capabilities.system_info import get_system_info
            if self.console:
                with self.console.status("[cyan]Collecting diagnostics…[/cyan]"):
                    info = await get_system_info()
            else:
                info = await get_system_info()

            if "error" in info:
                self._print_error(info["error"])
            elif self.console:
                from rich.table import Table
                table = Table(title="System Diagnostics", border_style="cyan")
                table.add_column("Metric", style="cyan")
                table.add_column("Value", style="bold")
                table.add_row("OS", f"{info['os']} {info['os_version']}")
                table.add_row("Hostname", info["hostname"])
                table.add_row("Architecture", info["architecture"])
                table.add_row("CPU Cores", f"{info['cpu']['physical_cores']} physical / {info['cpu']['logical_cores']} logical")
                table.add_row("CPU Usage", f"{info['cpu']['usage_percent']}%")
                table.add_row("CPU Freq", f"{info['cpu']['frequency_mhz']} MHz")
                mem = info["memory"]
                table.add_row("Memory", f"{mem['used_gb']} / {mem['total_gb']} GB  ({mem['usage_percent']}%)")
                disk = info["disk"]
                table.add_row("Disk", f"{disk['used_gb']} / {disk['total_gb']} GB  ({disk['usage_percent']}%)")
                table.add_row("Uptime", info["uptime"])
                table.add_row("Current Time", info["current_time"])
                self.console.print(table)
            else:
                print(f"OS: {info['os']}  CPU: {info['cpu']['usage_percent']}%  "
                      f"RAM: {info['memory']['used_gb']}/{info['memory']['total_gb']} GB")

        elif base == "/voice":
            if len(parts) > 1 and parts[1].lower() == "on":
                self._voice_enabled = True
                self._init_voice()
                self._print("[cyan]✓ Voice output enabled.[/cyan]")
            elif len(parts) > 1 and parts[1].lower() == "off":
                self._voice_enabled = False
                self._print("[cyan]✓ Voice output disabled.[/cyan]")
            else:
                state = "on" if self._voice_enabled else "off"
                self._print(f"[dim]Voice is currently {state}. Use /voice on or /voice off.[/dim]")

        return True  # continue running

    # ── Main run loop ──────────────────────────────────────────────────────────

    async def run(self):
        """Start the interactive JARVIS CLI session."""
        self._print_banner()

        # Greet
        greeting = (
            f"Good {'morning' if datetime.now().hour < 12 else 'afternoon' if datetime.now().hour < 18 else 'evening'}, "
            f"{self.jarvis.config.user_name}. All systems are online and I am at your service. "
            "How may I assist you today?"
        )
        self._print_jarvis(greeting)
        self._speak(greeting)

        while True:
            try:
                if self.console:
                    user_input = await asyncio.get_event_loop().run_in_executor(
                        None,
                        lambda: Prompt.ask("\n[bold blue]You[/bold blue]"),
                    )
                else:
                    user_input = await asyncio.get_event_loop().run_in_executor(
                        None, lambda: input("\nYou: ")
                    )
            except (EOFError, KeyboardInterrupt):
                self._print("\n[bold cyan]JARVIS:[/bold cyan] Powering down. Goodbye, sir.")
                break

            user_input = user_input.strip()
            if not user_input:
                continue

            # Handle slash commands
            if user_input.startswith("/"):
                should_continue = await self._handle_command(user_input)
                if not should_continue:
                    break
                continue

            # Regular chat
            self._print_user(user_input)

            def _on_tool_use(name: str, inp: dict):
                self._print_tool_use(name, inp)

            if self.console:
                with self.console.status(
                    "[cyan]JARVIS is thinking…[/cyan]", spinner="dots"
                ):
                    try:
                        response = await self.jarvis.chat(user_input, on_tool_use=_on_tool_use)
                    except anthropic.AuthenticationError:
                        self._print_error(
                            "Invalid ANTHROPIC_API_KEY. Please set a valid key and restart."
                        )
                        continue
                    except anthropic.RateLimitError:
                        self._print_error("Rate limit exceeded. Please wait a moment and try again.")
                        continue
                    except Exception as e:
                        self._print_error(f"Unexpected error: {e}")
                        continue
            else:
                print("JARVIS is thinking…")
                try:
                    response = await self.jarvis.chat(user_input, on_tool_use=_on_tool_use)
                except Exception as e:
                    self._print_error(str(e))
                    continue

            self._print_jarvis(response)
            self._speak(response)


# Allow running as module
import anthropic  # noqa: E402 (needed for exception types)
