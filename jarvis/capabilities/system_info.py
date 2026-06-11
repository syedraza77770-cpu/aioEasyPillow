import asyncio
import platform
from datetime import datetime
from typing import Any


async def get_system_info() -> dict[str, Any]:
    """Get comprehensive real-time system diagnostics."""
    def _collect():
        try:
            import psutil
        except ImportError:
            return {"error": "psutil not installed. Run: pip install psutil"}

        cpu_freq = psutil.cpu_freq()
        memory = psutil.virtual_memory()
        swap = psutil.swap_memory()
        disk = psutil.disk_usage("/")
        net = psutil.net_io_counters()
        boot_time = datetime.fromtimestamp(psutil.boot_time())
        uptime_secs = (datetime.now() - boot_time).total_seconds()
        uptime_str = f"{int(uptime_secs // 3600)}h {int((uptime_secs % 3600) // 60)}m"

        battery = None
        try:
            bat = psutil.sensors_battery()
            if bat:
                battery = {
                    "percent": bat.percent,
                    "plugged_in": bat.power_plugged,
                    "seconds_left": bat.secsleft if bat.secsleft != psutil.POWER_TIME_UNLIMITED else None,
                }
        except Exception:
            pass

        return {
            "os": platform.system(),
            "os_version": platform.release(),
            "architecture": platform.machine(),
            "hostname": platform.node(),
            "python_version": platform.python_version(),
            "cpu": {
                "physical_cores": psutil.cpu_count(logical=False),
                "logical_cores": psutil.cpu_count(logical=True),
                "usage_percent": psutil.cpu_percent(interval=0.5),
                "frequency_mhz": round(cpu_freq.current, 1) if cpu_freq else "N/A",
                "max_frequency_mhz": round(cpu_freq.max, 1) if cpu_freq else "N/A",
            },
            "memory": {
                "total_gb": round(memory.total / 1e9, 2),
                "used_gb": round(memory.used / 1e9, 2),
                "available_gb": round(memory.available / 1e9, 2),
                "usage_percent": memory.percent,
            },
            "swap": {
                "total_gb": round(swap.total / 1e9, 2),
                "used_gb": round(swap.used / 1e9, 2),
                "usage_percent": swap.percent,
            },
            "disk": {
                "total_gb": round(disk.total / 1e9, 2),
                "used_gb": round(disk.used / 1e9, 2),
                "free_gb": round(disk.free / 1e9, 2),
                "usage_percent": disk.percent,
            },
            "network": {
                "bytes_sent_mb": round(net.bytes_sent / 1e6, 2),
                "bytes_received_mb": round(net.bytes_recv / 1e6, 2),
            },
            "uptime": uptime_str,
            "boot_time": boot_time.strftime("%Y-%m-%d %H:%M:%S"),
            "current_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "battery": battery,
        }

    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, _collect)


async def get_top_processes(sort_by: str = "cpu", limit: int = 10) -> dict[str, Any]:
    """Get top CPU or memory consuming processes."""
    def _collect():
        try:
            import psutil
        except ImportError:
            return {"error": "psutil not installed"}

        procs = []
        for p in psutil.process_iter(["pid", "name", "cpu_percent", "memory_percent", "status"]):
            try:
                info = p.info
                procs.append({
                    "pid": info["pid"],
                    "name": info["name"],
                    "cpu_percent": round(info["cpu_percent"] or 0, 2),
                    "memory_percent": round(info["memory_percent"] or 0, 2),
                    "status": info["status"],
                })
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue

        key = "cpu_percent" if sort_by == "cpu" else "memory_percent"
        procs.sort(key=lambda x: x[key], reverse=True)
        return {"processes": procs[:limit], "sorted_by": sort_by}

    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, _collect)
