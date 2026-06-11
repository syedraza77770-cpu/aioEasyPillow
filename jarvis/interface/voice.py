"""
Voice interface for JARVIS — Speech-to-Text + Text-to-Speech.

Requires:
    pip install SpeechRecognition pyaudio pyttsx3

On Linux you may also need:
    sudo apt-get install portaudio19-dev python3-pyaudio espeak
"""

import asyncio
import threading
from typing import Callable


class VoiceInterface:
    """
    Handles microphone input (STT) and speaker output (TTS).
    Designed to be used alongside the CLI or standalone.
    """

    def __init__(self, rate: int = 150, volume: float = 0.9, language: str = "en-US"):
        self.rate = rate
        self.volume = volume
        self.language = language
        self._tts_engine = None
        self._recognizer = None
        self._microphone = None
        self._available = False
        self._init()

    def _init(self):
        try:
            import pyttsx3  # type: ignore
            import speech_recognition as sr  # type: ignore

            self._tts_engine = pyttsx3.init()
            self._tts_engine.setProperty("rate", self.rate)
            self._tts_engine.setProperty("volume", self.volume)

            # Prefer a good English voice
            voices = self._tts_engine.getProperty("voices")
            for v in voices:
                if "english" in v.name.lower() or "en_" in v.id.lower():
                    self._tts_engine.setProperty("voice", v.id)
                    break

            self._recognizer = sr.Recognizer()
            self._recognizer.energy_threshold = 300
            self._recognizer.dynamic_energy_threshold = True
            self._microphone = sr.Microphone()

            self._available = True
        except ImportError as e:
            print(
                f"[Voice] Required package missing: {e}\n"
                "Install with: pip install SpeechRecognition pyaudio pyttsx3"
            )
        except Exception as e:
            print(f"[Voice] Initialization failed: {e}")

    @property
    def available(self) -> bool:
        return self._available

    # ── TTS ───────────────────────────────────────────────────────────────────

    def speak(self, text: str):
        """Speak text aloud (blocking)."""
        if not self._available or not self._tts_engine:
            return
        import re
        clean = re.sub(r"[#*`|_\[\]()~>]", "", text)
        clean = re.sub(r"\n+", " ", clean).strip()
        self._tts_engine.say(clean[:1000])
        self._tts_engine.runAndWait()

    async def speak_async(self, text: str):
        """Speak text in a thread so it doesn't block the event loop."""
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, self.speak, text)

    # ── STT ───────────────────────────────────────────────────────────────────

    def listen(self, timeout: float = 5.0, phrase_limit: float = 15.0) -> str | None:
        """
        Listen for a spoken phrase and return the transcribed text.
        Returns None if nothing was heard or recognition failed.
        """
        if not self._available:
            return None

        import speech_recognition as sr  # type: ignore

        with self._microphone as source:  # type: ignore
            self._recognizer.adjust_for_ambient_noise(source, duration=0.5)
            try:
                audio = self._recognizer.listen(
                    source, timeout=timeout, phrase_time_limit=phrase_limit
                )
            except sr.WaitTimeoutError:
                return None

        try:
            text = self._recognizer.recognize_google(audio, language=self.language)
            return text
        except sr.UnknownValueError:
            return None
        except sr.RequestError as e:
            print(f"[Voice STT] Recognition service error: {e}")
            return None

    async def listen_async(
        self, timeout: float = 5.0, phrase_limit: float = 15.0
    ) -> str | None:
        """Non-blocking version of listen()."""
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self.listen, timeout, phrase_limit)

    # ── Continuous listening loop ─────────────────────────────────────────────

    async def listen_loop(
        self,
        on_speech: Callable[[str], None],
        wake_word: str = "jarvis",
        stop_phrase: str = "goodbye jarvis",
    ):
        """
        Continuously listen for the wake word, then capture and forward commands.

        ``on_speech`` is called with the transcribed command text.
        """
        if not self._available:
            print("[Voice] Voice unavailable. Cannot start listen loop.")
            return

        print(f"[Voice] Listening for wake word: '{wake_word}' …")
        self.speak(f"Voice mode active. Say '{wake_word}' followed by your command.")

        while True:
            text = await self.listen_async(timeout=10.0)
            if text is None:
                continue
            text_lower = text.lower()

            if stop_phrase in text_lower:
                self.speak("Voice mode deactivated. Goodbye, sir.")
                break

            if wake_word.lower() in text_lower:
                # Remove wake word and send the remainder
                command = text_lower.replace(wake_word.lower(), "").strip()
                if command:
                    on_speech(command)
                else:
                    self.speak("Yes, sir? How may I assist?")
