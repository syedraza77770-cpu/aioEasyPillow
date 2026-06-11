"""Core Jarvis AI engine — Claude API agentic loop with tool use."""

import json
import os
from datetime import datetime
from pathlib import Path
from typing import Any, Callable

import anthropic

from .config import JarvisConfig
from .capabilities.tools import JARVIS_TOOLS
from .capabilities.notes import NotesManager
from .capabilities.web_search import search_web, search_news
from .capabilities.weather import get_weather
from .capabilities.system_info import get_system_info, get_top_processes
from .capabilities.calculator import calculate, unit_convert
from .capabilities.image_gen import generate_image_card
from .capabilities.wikipedia_tool import get_wikipedia_summary
from .capabilities.code_runner import run_python

_SYSTEM_PROMPT = """\
You are JARVIS — Just A Rather Very Intelligent System — a state-of-the-art AI \
assistant inspired by the AI from the Iron Man series, enhanced with every modern \
real-world capability available today.

## Personality
- Highly intelligent, eloquent, and occasionally witty with dry British humor
- Formal yet warm; address the user as "{user_name}" or by their name if given
- Proactive — if real-time data would improve your answer, use your tools; do not guess
- Confident but honest about the limits of your knowledge
- Thorough but concise — give exactly what is needed, nothing more

## Capabilities (tools available)
- **Web search** — real-time information, current events, research
- **News search** — latest headlines on any topic
- **Weather** — worldwide current conditions and forecasts
- **System diagnostics** — CPU, RAM, disk, uptime, top processes
- **Mathematics** — arithmetic through advanced calculus and combinatorics
- **Unit conversion** — length, weight, temperature, data, speed, area, volume
- **Note-taking** — save, retrieve, and delete notes with tags
- **Reminders** — set, list, and complete time-based reminders
- **Image generation** — create styled Jarvis-themed image cards (PNG)
- **Wikipedia** — encyclopaedic summaries on any topic
- **File operations** — read, write, list files on the local system
- **Python sandbox** — execute safe Python snippets for demonstrations
- **Conversation memory** — persistent across sessions; clearable on request

## Behavioral rules
1. Always prefer tool data over training knowledge for anything time-sensitive
2. Chain multiple tools in a single turn when the question requires it
3. After using tools, synthesize the results into a clear, readable response
4. Never fabricate URLs, statistics, or quotes — use web_search to verify
5. For code requests, write clean, idiomatic, well-explained code
6. For creative tasks, be original and engaging

Current datetime: {datetime}
"""


class Jarvis:
    """The Jarvis AI assistant — orchestrates Claude with tool use."""

    def __init__(self, config: JarvisConfig):
        self.config = config
        self.client = anthropic.AsyncAnthropic(api_key=config.anthropic_api_key)
        self.notes = NotesManager(config.notes_file)
        self._memory_path = Path(config.memory_file)
        # In-session messages for the current API conversation thread
        self._session: list[dict] = []
        self._load_history()

    # ── Persistence ────────────────────────────────────────────────────────────

    def _load_history(self):
        """Load prior text-only exchange history into session context."""
        if not self._memory_path.exists():
            return
        try:
            with open(self._memory_path, "r") as f:
                data = json.load(f)
            # Restore last N text exchanges (skip tool-use internals)
            for msg in data.get("messages", [])[-self.config.max_history * 2:]:
                if isinstance(msg.get("content"), str) and msg["content"].strip():
                    self._session.append({"role": msg["role"], "content": msg["content"]})
        except (json.JSONDecodeError, OSError, KeyError):
            pass

    def _persist_exchange(self, user_msg: str, assistant_reply: str):
        """Append a text exchange to the persistent memory file."""
        if self._memory_path.exists():
            try:
                with open(self._memory_path, "r") as f:
                    data = json.load(f)
            except (json.JSONDecodeError, OSError):
                data = {"messages": []}
        else:
            data = {"messages": []}

        data["messages"].append(
            {"role": "user", "content": user_msg, "ts": datetime.now().isoformat()}
        )
        data["messages"].append(
            {"role": "assistant", "content": assistant_reply, "ts": datetime.now().isoformat()}
        )
        data["messages"] = data["messages"][-200:]  # keep last 200
        data["last_updated"] = datetime.now().isoformat()
        with open(self._memory_path, "w") as f:
            json.dump(data, f, indent=2)

    def clear_memory(self):
        self._session.clear()
        if self._memory_path.exists():
            self._memory_path.write_text(json.dumps({"messages": []}, indent=2))

    # ── Tool dispatch ──────────────────────────────────────────────────────────

    async def _dispatch(self, tool_name: str, tool_input: dict[str, Any]) -> Any:
        """Route a tool call to the appropriate capability."""
        try:
            match tool_name:
                case "web_search":
                    return await search_web(
                        tool_input["query"], tool_input.get("max_results", 5)
                    )
                case "search_news":
                    return await search_news(
                        tool_input["query"], tool_input.get("max_results", 5)
                    )
                case "get_weather":
                    return await get_weather(tool_input["location"])
                case "get_system_info":
                    return await get_system_info()
                case "get_top_processes":
                    return await get_top_processes(
                        tool_input.get("sort_by", "cpu"), tool_input.get("limit", 10)
                    )
                case "calculate":
                    return await calculate(tool_input["expression"])
                case "unit_convert":
                    return await unit_convert(
                        tool_input["value"], tool_input["from_unit"], tool_input["to_unit"]
                    )
                case "get_datetime":
                    now = datetime.now()
                    return {
                        "date": now.strftime("%Y-%m-%d"),
                        "time": now.strftime("%H:%M:%S"),
                        "day_of_week": now.strftime("%A"),
                        "iso": now.isoformat(),
                        "unix_timestamp": int(now.timestamp()),
                    }
                case "add_note":
                    note = self.notes.add_note(
                        tool_input["title"],
                        tool_input["content"],
                        tool_input.get("tags"),
                    )
                    return {"success": True, "note": note}
                case "get_notes":
                    return {"notes": self.notes.get_notes(tool_input.get("tag"))}
                case "delete_note":
                    ok = self.notes.delete_note(tool_input["note_id"])
                    return {"success": ok}
                case "add_reminder":
                    r = self.notes.add_reminder(
                        tool_input["title"],
                        tool_input["datetime_str"],
                        tool_input.get("description", ""),
                        tool_input.get("priority", "medium"),
                    )
                    return {"success": True, "reminder": r}
                case "get_reminders":
                    return {
                        "reminders": self.notes.get_reminders(
                            tool_input.get("include_completed", False)
                        )
                    }
                case "complete_reminder":
                    ok = self.notes.complete_reminder(tool_input["reminder_id"])
                    return {"success": ok}
                case "generate_image_card":
                    return await generate_image_card(**tool_input)
                case "get_wikipedia_summary":
                    return await get_wikipedia_summary(
                        tool_input["topic"], tool_input.get("sentences", 5)
                    )
                case "read_file":
                    fp = tool_input["filepath"]
                    try:
                        content = Path(fp).read_text()
                        return {"content": content, "filepath": fp, "size_bytes": len(content)}
                    except FileNotFoundError:
                        return {"error": f"File not found: {fp}"}
                    except OSError as e:
                        return {"error": str(e)}
                case "write_file":
                    fp = tool_input["filepath"]
                    mode = tool_input.get("mode", "w")
                    try:
                        with open(fp, mode) as fh:
                            fh.write(tool_input["content"])
                        return {"success": True, "filepath": fp}
                    except OSError as e:
                        return {"error": str(e)}
                case "list_directory":
                    path = tool_input.get("path", ".")
                    try:
                        entries = []
                        for item in sorted(Path(path).iterdir()):
                            entries.append({
                                "name": item.name,
                                "type": "dir" if item.is_dir() else "file",
                                "size_bytes": item.stat().st_size if item.is_file() else None,
                            })
                        return {"entries": entries, "path": path, "count": len(entries)}
                    except OSError as e:
                        return {"error": str(e)}
                case "run_python":
                    return await run_python(tool_input["code"])
                case "clear_memory":
                    self.clear_memory()
                    return {"success": True, "message": "Conversation history cleared."}
                case _:
                    return {"error": f"Unknown tool: {tool_name}"}
        except Exception as e:
            return {"error": f"Tool '{tool_name}' raised an exception: {type(e).__name__}: {e}"}

    # ── Main chat loop ─────────────────────────────────────────────────────────

    async def chat(
        self,
        user_message: str,
        on_tool_use: Callable[[str, dict], None] | None = None,
    ) -> str:
        """
        Send a user message through the agentic tool-use loop and return
        the final text response from JARVIS.

        ``on_tool_use`` is called (synchronously) each time JARVIS invokes a
        tool, with (tool_name, tool_input) — useful for UI progress callbacks.
        """
        system = _SYSTEM_PROMPT.format(
            user_name=self.config.user_name,
            datetime=datetime.now().strftime("%Y-%m-%d %H:%M:%S, %A"),
        )

        # Build the message list for this turn
        messages: list[dict] = list(self._session)
        messages.append({"role": "user", "content": user_message})

        final_text = ""

        while True:
            response = await self.client.messages.create(
                model=self.config.model,
                max_tokens=self.config.max_tokens,
                system=system,
                messages=messages,
                tools=JARVIS_TOOLS,
            )

            if response.stop_reason == "tool_use":
                # Append assistant's turn (may include text + tool_use blocks)
                messages.append({"role": "assistant", "content": response.content})

                # Execute each tool and collect results
                tool_results = []
                for block in response.content:
                    if block.type == "tool_use":
                        if on_tool_use:
                            on_tool_use(block.name, block.input)
                        result = await self._dispatch(block.name, block.input)
                        tool_results.append({
                            "type": "tool_result",
                            "tool_use_id": block.id,
                            "content": json.dumps(result, ensure_ascii=False, default=str),
                        })

                messages.append({"role": "user", "content": tool_results})

            elif response.stop_reason == "end_turn":
                for block in response.content:
                    if hasattr(block, "text"):
                        final_text += block.text
                break

            elif response.stop_reason == "max_tokens":
                for block in response.content:
                    if hasattr(block, "text"):
                        final_text += block.text
                final_text += "\n\n*(Response truncated — max tokens reached.)*"
                break

            else:
                final_text = f"Unexpected stop reason: {response.stop_reason}"
                break

        # Persist the text exchange and update session with the clean text pair
        self._persist_exchange(user_message, final_text)
        self._session.append({"role": "user", "content": user_message})
        self._session.append({"role": "assistant", "content": final_text})
        # Cap in-session history
        if len(self._session) > self.config.max_history * 2:
            self._session = self._session[-(self.config.max_history * 2):]

        return final_text
