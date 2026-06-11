import json
from datetime import datetime
from pathlib import Path
from typing import Any


class NotesManager:
    def __init__(self, filepath: str = "jarvis_notes.json"):
        self.filepath = Path(filepath)
        self._data: dict = {"notes": [], "reminders": []}
        self._load()

    def _load(self):
        if self.filepath.exists():
            try:
                with open(self.filepath, "r") as f:
                    self._data = json.load(f)
            except (json.JSONDecodeError, OSError):
                pass

    def _save(self):
        self._data["last_updated"] = datetime.now().isoformat()
        with open(self.filepath, "w") as f:
            json.dump(self._data, f, indent=2)

    # ── Notes ──────────────────────────────────────────────────────────────────

    def add_note(self, title: str, content: str, tags: list[str] | None = None) -> dict[str, Any]:
        note = {
            "id": self._next_id("notes"),
            "title": title,
            "content": content,
            "tags": tags or [],
            "created": datetime.now().isoformat(),
            "modified": datetime.now().isoformat(),
        }
        self._data["notes"].append(note)
        self._save()
        return note

    def get_notes(self, tag: str | None = None) -> list[dict]:
        notes = self._data["notes"]
        if tag:
            notes = [n for n in notes if tag.lower() in [t.lower() for t in n.get("tags", [])]]
        return notes

    def delete_note(self, note_id: int) -> bool:
        for i, note in enumerate(self._data["notes"]):
            if note["id"] == note_id:
                self._data["notes"].pop(i)
                self._save()
                return True
        return False

    # ── Reminders ──────────────────────────────────────────────────────────────

    def add_reminder(
        self,
        title: str,
        datetime_str: str,
        description: str = "",
        priority: str = "medium",
    ) -> dict[str, Any]:
        reminder = {
            "id": self._next_id("reminders"),
            "title": title,
            "datetime": datetime_str,
            "description": description,
            "priority": priority,
            "created": datetime.now().isoformat(),
            "completed": False,
        }
        self._data["reminders"].append(reminder)
        self._save()
        return reminder

    def get_reminders(self, include_completed: bool = False) -> list[dict]:
        reminders = self._data["reminders"]
        if not include_completed:
            reminders = [r for r in reminders if not r.get("completed", False)]
        return sorted(reminders, key=lambda r: r.get("datetime", ""), reverse=False)

    def complete_reminder(self, reminder_id: int) -> bool:
        for reminder in self._data["reminders"]:
            if reminder["id"] == reminder_id:
                reminder["completed"] = True
                reminder["completed_at"] = datetime.now().isoformat()
                self._save()
                return True
        return False

    # ── Helpers ────────────────────────────────────────────────────────────────

    def _next_id(self, collection: str) -> int:
        items = self._data.get(collection, [])
        return max((item["id"] for item in items), default=0) + 1
