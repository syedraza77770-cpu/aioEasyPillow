import asyncio
from typing import Any


async def get_weather(location: str) -> dict[str, Any]:
    """Get current weather via wttr.in (free, no API key required)."""
    try:
        import aiohttp
    except ImportError:
        return {"error": "aiohttp not installed"}

    url = f"https://wttr.in/{location}?format=j1"
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url, timeout=aiohttp.ClientTimeout(total=10)) as resp:
                if resp.status != 200:
                    return {"error": f"Weather service returned {resp.status} for '{location}'"}
                data = await resp.json(content_type=None)

        current = data["current_condition"][0]
        nearest = data["nearest_area"][0]
        area_name = nearest["areaName"][0]["value"]
        country = nearest["country"][0]["value"]

        # Parse 3-day forecast
        forecast = []
        for day in data.get("weather", []):
            forecast.append({
                "date": day["date"],
                "max_temp_c": day["maxtempC"],
                "min_temp_c": day["mintempC"],
                "description": day["hourly"][4]["weatherDesc"][0]["value"] if day["hourly"] else "N/A",
                "sunrise": day["astronomy"][0]["sunrise"],
                "sunset": day["astronomy"][0]["sunset"],
            })

        return {
            "location": f"{area_name}, {country}",
            "temperature_c": current["temp_C"],
            "temperature_f": current["temp_F"],
            "feels_like_c": current["FeelsLikeC"],
            "feels_like_f": current["FeelsLikeF"],
            "humidity_percent": current["humidity"],
            "weather_description": current["weatherDesc"][0]["value"],
            "wind_speed_kmph": current["windspeedKmph"],
            "wind_direction": current["winddir16Point"],
            "visibility_km": current["visibility"],
            "uv_index": current["uvIndex"],
            "pressure_mb": current["pressure"],
            "cloud_cover_percent": current["cloudcover"],
            "3_day_forecast": forecast,
        }
    except asyncio.TimeoutError:
        return {"error": f"Weather request timed out for '{location}'"}
    except Exception as e:
        return {"error": str(e)}
