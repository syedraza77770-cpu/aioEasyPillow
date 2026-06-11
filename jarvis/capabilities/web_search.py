import asyncio
from typing import Any


async def search_web(query: str, max_results: int = 5) -> dict[str, Any]:
    """Search the web using DuckDuckGo (no API key required)."""
    def _search():
        try:
            from duckduckgo_search import DDGS
            with DDGS() as ddgs:
                results = list(ddgs.text(query, max_results=max_results))
            return {"results": results, "query": query}
        except ImportError:
            return {"error": "duckduckgo_search not installed. Run: pip install duckduckgo-search"}
        except Exception as e:
            return {"error": str(e), "query": query}

    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, _search)


async def search_news(query: str, max_results: int = 5) -> dict[str, Any]:
    """Search recent news using DuckDuckGo."""
    def _search():
        try:
            from duckduckgo_search import DDGS
            with DDGS() as ddgs:
                results = list(ddgs.news(query, max_results=max_results))
            return {"results": results, "query": query}
        except ImportError:
            return {"error": "duckduckgo_search not installed. Run: pip install duckduckgo-search"}
        except Exception as e:
            return {"error": str(e), "query": query}

    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, _search)
