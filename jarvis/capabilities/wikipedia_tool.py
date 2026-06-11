import asyncio
from typing import Any


async def get_wikipedia_summary(topic: str, sentences: int = 5) -> dict[str, Any]:
    """Fetch a summary from Wikipedia."""
    def _fetch():
        try:
            import wikipedia  # type: ignore
            wikipedia.set_lang("en")
            try:
                summary = wikipedia.summary(topic, sentences=sentences, auto_suggest=True)
                page = wikipedia.page(topic, auto_suggest=True)
                return {
                    "title": page.title,
                    "summary": summary,
                    "url": page.url,
                    "categories": page.categories[:5],
                }
            except wikipedia.exceptions.DisambiguationError as e:
                # Return the first option
                options = e.options[:5]
                try:
                    summary = wikipedia.summary(options[0], sentences=sentences)
                    return {
                        "title": options[0],
                        "summary": summary,
                        "disambiguation_options": options,
                        "note": f"'{topic}' was ambiguous. Showing results for '{options[0]}'.",
                    }
                except Exception:
                    return {
                        "disambiguation_options": options,
                        "note": f"'{topic}' is ambiguous. Please be more specific.",
                    }
            except wikipedia.exceptions.PageError:
                return {"error": f"No Wikipedia article found for '{topic}'."}
        except ImportError:
            # Fallback: use DuckDuckGo instant answers
            try:
                from duckduckgo_search import DDGS
                with DDGS() as ddgs:
                    results = list(ddgs.text(f"{topic} wikipedia", max_results=3))
                if results:
                    return {
                        "fallback": True,
                        "note": "wikipedia package not installed; using web search fallback",
                        "results": results,
                    }
            except Exception:
                pass
            return {"error": "wikipedia package not installed. Run: pip install wikipedia"}

    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, _fetch)
