import os
from dataclasses import dataclass, field


@dataclass
class JarvisConfig:
    anthropic_api_key: str = field(default_factory=lambda: os.getenv("ANTHROPIC_API_KEY", ""))
    model: str = field(default_factory=lambda: os.getenv("JARVIS_MODEL", "claude-sonnet-4-6"))
    max_tokens: int = 4096
    max_history: int = 30
    memory_file: str = "jarvis_memory.json"
    notes_file: str = "jarvis_notes.json"
    voice_enabled: bool = field(
        default_factory=lambda: os.getenv("JARVIS_VOICE", "false").lower() == "true"
    )
    voice_rate: int = 150
    voice_volume: float = 0.9
    user_name: str = field(default_factory=lambda: os.getenv("JARVIS_USER", "sir"))

    def validate(self) -> list[str]:
        errors = []
        if not self.anthropic_api_key:
            errors.append("ANTHROPIC_API_KEY environment variable is not set.")
        return errors
