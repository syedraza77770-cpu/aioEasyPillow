"""Tool definitions for the Claude API agentic loop."""

JARVIS_TOOLS = [
    {
        "name": "web_search",
        "description": (
            "Search the web for current, real-time information on any topic. "
            "Use this for recent events, news, facts you are not sure about, "
            "or anything that requires up-to-date data."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "The search query"},
                "max_results": {
                    "type": "integer",
                    "description": "Maximum results to return (default: 5)",
                    "default": 5,
                },
            },
            "required": ["query"],
        },
    },
    {
        "name": "search_news",
        "description": "Search for recent news articles and headlines on any topic.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "News search query"},
                "max_results": {
                    "type": "integer",
                    "description": "Maximum results (default: 5)",
                    "default": 5,
                },
            },
            "required": ["query"],
        },
    },
    {
        "name": "get_weather",
        "description": (
            "Get current weather conditions and forecast for any location worldwide. "
            "Returns temperature, humidity, wind, UV index, and more."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "City name, region, country, or coordinates",
                }
            },
            "required": ["location"],
        },
    },
    {
        "name": "get_system_info",
        "description": (
            "Get real-time system diagnostics: CPU usage, memory, disk space, "
            "OS details, uptime, and running processes."
        ),
        "input_schema": {"type": "object", "properties": {}, "required": []},
    },
    {
        "name": "get_top_processes",
        "description": "Get the top CPU or memory consuming processes currently running.",
        "input_schema": {
            "type": "object",
            "properties": {
                "sort_by": {
                    "type": "string",
                    "description": "Sort by 'cpu' or 'memory' (default: cpu)",
                    "enum": ["cpu", "memory"],
                },
                "limit": {
                    "type": "integer",
                    "description": "Number of processes to return (default: 10)",
                    "default": 10,
                },
            },
            "required": [],
        },
    },
    {
        "name": "calculate",
        "description": (
            "Perform mathematical calculations. Supports arithmetic, trigonometry, "
            "logarithms, factorials, sqrt, pi, e, and more."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "expression": {
                    "type": "string",
                    "description": "Math expression (e.g. 'sqrt(144)', 'factorial(10)', '2**32')",
                }
            },
            "required": ["expression"],
        },
    },
    {
        "name": "unit_convert",
        "description": "Convert between units of measurement (length, weight, temperature, data, speed, etc.).",
        "input_schema": {
            "type": "object",
            "properties": {
                "value": {"type": "number", "description": "The numeric value to convert"},
                "from_unit": {"type": "string", "description": "Source unit (e.g. 'km', 'kg', 'celsius', 'MB')"},
                "to_unit": {"type": "string", "description": "Target unit (e.g. 'miles', 'lbs', 'fahrenheit', 'GB')"},
            },
            "required": ["value", "from_unit", "to_unit"],
        },
    },
    {
        "name": "get_datetime",
        "description": "Get the current date, time, day of the week, and Unix timestamp.",
        "input_schema": {"type": "object", "properties": {}, "required": []},
    },
    {
        "name": "add_note",
        "description": "Save a note with a title, content, and optional tags for later retrieval.",
        "input_schema": {
            "type": "object",
            "properties": {
                "title": {"type": "string", "description": "Note title"},
                "content": {"type": "string", "description": "Note content"},
                "tags": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Optional list of tags (e.g. ['work', 'important'])",
                },
            },
            "required": ["title", "content"],
        },
    },
    {
        "name": "get_notes",
        "description": "Retrieve all saved notes, optionally filtered by tag.",
        "input_schema": {
            "type": "object",
            "properties": {
                "tag": {"type": "string", "description": "Optional tag filter"}
            },
            "required": [],
        },
    },
    {
        "name": "delete_note",
        "description": "Delete a note by its ID.",
        "input_schema": {
            "type": "object",
            "properties": {
                "note_id": {"type": "integer", "description": "The ID of the note to delete"}
            },
            "required": ["note_id"],
        },
    },
    {
        "name": "add_reminder",
        "description": "Set a reminder with a title, due datetime, and optional description.",
        "input_schema": {
            "type": "object",
            "properties": {
                "title": {"type": "string", "description": "Reminder title"},
                "datetime_str": {
                    "type": "string",
                    "description": "Due date/time (e.g. '2025-12-25 09:00', 'tomorrow at 3pm')",
                },
                "description": {"type": "string", "description": "Optional details"},
                "priority": {
                    "type": "string",
                    "description": "Priority: 'low', 'medium', or 'high'",
                    "enum": ["low", "medium", "high"],
                },
            },
            "required": ["title", "datetime_str"],
        },
    },
    {
        "name": "get_reminders",
        "description": "Get all pending (and optionally completed) reminders.",
        "input_schema": {
            "type": "object",
            "properties": {
                "include_completed": {
                    "type": "boolean",
                    "description": "Include completed reminders (default: false)",
                }
            },
            "required": [],
        },
    },
    {
        "name": "complete_reminder",
        "description": "Mark a reminder as completed.",
        "input_schema": {
            "type": "object",
            "properties": {
                "reminder_id": {"type": "integer", "description": "The reminder ID to mark complete"}
            },
            "required": ["reminder_id"],
        },
    },
    {
        "name": "generate_image_card",
        "description": (
            "Generate a stylized image card using the aioEasyPillow library. "
            "Creates a visually appealing PNG image with title, subtitle, colors, and decorative elements."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "title": {"type": "string", "description": "Main title text on the card"},
                "subtitle": {"type": "string", "description": "Optional subtitle or body text"},
                "footer": {"type": "string", "description": "Optional footer text"},
                "bg_color": {
                    "type": "string",
                    "description": "Background color hex (e.g. '#0d1117', '#1a1a2e'). Default: dark blue.",
                },
                "accent_color": {
                    "type": "string",
                    "description": "Accent/highlight color hex (e.g. '#00ff88', '#00bcd4'). Default: cyan.",
                },
                "output_filename": {
                    "type": "string",
                    "description": "Output filename (default: 'jarvis_card.png')",
                },
                "width": {"type": "integer", "description": "Width in pixels (default: 900)"},
                "height": {"type": "integer", "description": "Height in pixels (default: 450)"},
            },
            "required": ["title"],
        },
    },
    {
        "name": "read_file",
        "description": "Read the contents of a local file.",
        "input_schema": {
            "type": "object",
            "properties": {
                "filepath": {"type": "string", "description": "Absolute or relative path to the file"}
            },
            "required": ["filepath"],
        },
    },
    {
        "name": "write_file",
        "description": "Write or append content to a local file.",
        "input_schema": {
            "type": "object",
            "properties": {
                "filepath": {"type": "string", "description": "Path to the file"},
                "content": {"type": "string", "description": "Content to write"},
                "mode": {
                    "type": "string",
                    "description": "'w' to overwrite (default) or 'a' to append",
                    "enum": ["w", "a"],
                },
            },
            "required": ["filepath", "content"],
        },
    },
    {
        "name": "list_directory",
        "description": "List files and directories at a given path.",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {
                    "type": "string",
                    "description": "Directory path (default: current directory '.')",
                }
            },
            "required": [],
        },
    },
    {
        "name": "clear_memory",
        "description": "Clear the entire conversation history and start fresh.",
        "input_schema": {"type": "object", "properties": {}, "required": []},
    },
    {
        "name": "get_wikipedia_summary",
        "description": "Get a summary of a topic from Wikipedia.",
        "input_schema": {
            "type": "object",
            "properties": {
                "topic": {"type": "string", "description": "Topic to look up on Wikipedia"},
                "sentences": {
                    "type": "integer",
                    "description": "Number of sentences to return (default: 5)",
                    "default": 5,
                },
            },
            "required": ["topic"],
        },
    },
    {
        "name": "run_python",
        "description": (
            "Safely execute a small Python code snippet and return stdout. "
            "Use for demonstrations, data transformations, or quick computations. "
            "Network access, file system writes, and dangerous builtins are restricted."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "code": {
                    "type": "string",
                    "description": "Python code to execute (must be safe and self-contained)",
                }
            },
            "required": ["code"],
        },
    },
]
