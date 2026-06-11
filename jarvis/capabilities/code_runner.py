"""Safe sandboxed Python code execution."""

import asyncio
import io
import sys
from contextlib import redirect_stdout, redirect_stderr
from typing import Any

_BLOCKED_BUILTINS = {
    "exec", "eval", "compile", "open", "__import__",
    "breakpoint", "input", "memoryview",
}

_SAFE_BUILTINS = {
    k: v
    for k, v in __builtins__.items()  # type: ignore[union-attr]
    if k not in _BLOCKED_BUILTINS
} if isinstance(__builtins__, dict) else {
    k: getattr(__builtins__, k)
    for k in dir(__builtins__)
    if k not in _BLOCKED_BUILTINS and not k.startswith("_")
}

_ALLOWED_IMPORTS = {
    "math", "random", "statistics", "decimal", "fractions",
    "datetime", "time", "calendar",
    "string", "re", "textwrap",
    "itertools", "functools", "operator",
    "collections", "heapq", "bisect", "array",
    "json", "csv",
    "hashlib", "base64",
    "pprint",
}


async def run_python(code: str, timeout: float = 10.0) -> dict[str, Any]:
    """Execute a sandboxed Python snippet and return its output."""
    # Block obviously dangerous patterns
    dangerous = [
        "import os", "import sys", "import subprocess", "import socket",
        "import threading", "import multiprocessing", "import ctypes",
        "import importlib", "__class__", "__subclasses__", "__mro__",
        "open(", "exec(", "eval(", "compile(", "__import__(",
    ]
    code_lower = code.lower()
    for pattern in dangerous:
        if pattern.lower() in code_lower:
            return {
                "error": f"Blocked: '{pattern}' is not allowed in sandboxed execution.",
                "code": code,
            }

    def _run():
        stdout_buf = io.StringIO()
        stderr_buf = io.StringIO()
        namespace: dict = {"__builtins__": _SAFE_BUILTINS}

        # Allow whitelisted imports
        def safe_import(name, *args, **kwargs):
            base = name.split(".")[0]
            if base in _ALLOWED_IMPORTS:
                return __import__(name, *args, **kwargs)
            raise ImportError(f"Import of '{name}' is not allowed in sandboxed mode.")

        namespace["__builtins__"]["__import__"] = safe_import  # type: ignore

        try:
            with redirect_stdout(stdout_buf), redirect_stderr(stderr_buf):
                exec(compile(code, "<jarvis_sandbox>", "exec"), namespace)  # noqa: S102
            stdout = stdout_buf.getvalue()
            stderr = stderr_buf.getvalue()
            return {
                "stdout": stdout,
                "stderr": stderr,
                "success": True,
                "code": code,
            }
        except Exception as e:
            return {
                "error": f"{type(e).__name__}: {e}",
                "stderr": stderr_buf.getvalue(),
                "success": False,
                "code": code,
            }

    loop = asyncio.get_event_loop()
    try:
        result = await asyncio.wait_for(
            loop.run_in_executor(None, _run), timeout=timeout
        )
    except asyncio.TimeoutError:
        return {"error": f"Execution timed out after {timeout}s", "code": code}

    return result
