import ast
import math
from typing import Any

_SAFE_NAMES = {
    "abs": abs,
    "round": round,
    "min": min,
    "max": max,
    "sum": sum,
    "pow": pow,
    "len": len,
    "int": int,
    "float": float,
    "str": str,
    "bool": bool,
    "list": list,
    "tuple": tuple,
    "range": range,
    "sorted": sorted,
    "reversed": reversed,
    "enumerate": enumerate,
    "zip": zip,
    # math module attributes
    "math": math,
    "pi": math.pi,
    "e": math.e,
    "tau": math.tau,
    "inf": math.inf,
    "sin": math.sin,
    "cos": math.cos,
    "tan": math.tan,
    "asin": math.asin,
    "acos": math.acos,
    "atan": math.atan,
    "atan2": math.atan2,
    "sinh": math.sinh,
    "cosh": math.cosh,
    "tanh": math.tanh,
    "sqrt": math.sqrt,
    "cbrt": math.cbrt if hasattr(math, "cbrt") else lambda x: x ** (1 / 3),
    "log": math.log,
    "log2": math.log2,
    "log10": math.log10,
    "exp": math.exp,
    "floor": math.floor,
    "ceil": math.ceil,
    "factorial": math.factorial,
    "gcd": math.gcd,
    "lcm": math.lcm if hasattr(math, "lcm") else None,
    "hypot": math.hypot,
    "degrees": math.degrees,
    "radians": math.radians,
    "isnan": math.isnan,
    "isinf": math.isinf,
    "comb": math.comb,
    "perm": math.perm,
}

_SAFE_GLOBALS = {"__builtins__": {}, **_SAFE_NAMES}

_BLOCKED_NODES = (
    ast.Import,
    ast.ImportFrom,
    ast.FunctionDef,
    ast.AsyncFunctionDef,
    ast.ClassDef,
    ast.Global,
    ast.Nonlocal,
    ast.Delete,
)


def _is_safe_ast(tree: ast.AST) -> bool:
    for node in ast.walk(tree):
        if isinstance(node, _BLOCKED_NODES):
            return False
        # Block attribute access on unknown objects (allow math.xxx)
        if isinstance(node, ast.Attribute):
            if isinstance(node.value, ast.Name) and node.value.id not in ("math",):
                return False
    return True


async def calculate(expression: str) -> dict[str, Any]:
    """Safely evaluate a mathematical expression."""
    expression = expression.strip()
    try:
        tree = ast.parse(expression, mode="eval")
    except SyntaxError as e:
        return {"error": f"Syntax error: {e}", "expression": expression}

    if not _is_safe_ast(tree):
        return {"error": "Expression contains disallowed operations.", "expression": expression}

    try:
        result = eval(compile(tree, "<expr>", "eval"), _SAFE_GLOBALS)
        return {"result": result, "expression": expression}
    except ZeroDivisionError:
        return {"error": "Division by zero", "expression": expression}
    except OverflowError:
        return {"error": "Result too large (overflow)", "expression": expression}
    except Exception as e:
        return {"error": str(e), "expression": expression}


_CONVERSIONS: dict[str, dict[str, float]] = {
    # Length (base: meter)
    "length": {
        "m": 1, "meter": 1, "meters": 1,
        "km": 1000, "kilometer": 1000, "kilometers": 1000,
        "cm": 0.01, "centimeter": 0.01, "centimeters": 0.01,
        "mm": 0.001, "millimeter": 0.001, "millimeters": 0.001,
        "mile": 1609.344, "miles": 1609.344, "mi": 1609.344,
        "yard": 0.9144, "yards": 0.9144, "yd": 0.9144,
        "foot": 0.3048, "feet": 0.3048, "ft": 0.3048,
        "inch": 0.0254, "inches": 0.0254, "in": 0.0254,
        "nautical_mile": 1852, "nm": 1852,
        "light_year": 9.461e15, "ly": 9.461e15,
    },
    # Weight (base: kg)
    "weight": {
        "kg": 1, "kilogram": 1, "kilograms": 1,
        "g": 0.001, "gram": 0.001, "grams": 0.001,
        "mg": 1e-6, "milligram": 1e-6, "milligrams": 1e-6,
        "lb": 0.453592, "lbs": 0.453592, "pound": 0.453592, "pounds": 0.453592,
        "oz": 0.0283495, "ounce": 0.0283495, "ounces": 0.0283495,
        "ton": 1000, "tonne": 1000, "metric_ton": 1000,
        "us_ton": 907.185,
    },
    # Data (base: bytes)
    "data": {
        "b": 1, "byte": 1, "bytes": 1,
        "kb": 1024, "kilobyte": 1024, "kilobytes": 1024,
        "mb": 1024 ** 2, "megabyte": 1024 ** 2, "megabytes": 1024 ** 2,
        "gb": 1024 ** 3, "gigabyte": 1024 ** 3, "gigabytes": 1024 ** 3,
        "tb": 1024 ** 4, "terabyte": 1024 ** 4, "terabytes": 1024 ** 4,
        "pb": 1024 ** 5, "petabyte": 1024 ** 5, "petabytes": 1024 ** 5,
        "kib": 1024, "mib": 1024 ** 2, "gib": 1024 ** 3, "tib": 1024 ** 4,
    },
    # Speed (base: m/s)
    "speed": {
        "m/s": 1, "ms": 1,
        "km/h": 1 / 3.6, "kmh": 1 / 3.6, "kph": 1 / 3.6,
        "mph": 0.44704, "mi/h": 0.44704,
        "knot": 0.514444, "knots": 0.514444, "kt": 0.514444,
        "mach": 343,
    },
    # Area (base: m²)
    "area": {
        "m2": 1, "sqm": 1, "square_meter": 1,
        "km2": 1e6, "sqkm": 1e6,
        "cm2": 1e-4, "sqcm": 1e-4,
        "ft2": 0.092903, "sqft": 0.092903,
        "in2": 6.4516e-4, "sqin": 6.4516e-4,
        "acre": 4046.86, "acres": 4046.86,
        "hectare": 10000, "ha": 10000,
        "mile2": 2.59e6, "sqmile": 2.59e6,
    },
    # Volume (base: liters)
    "volume": {
        "l": 1, "liter": 1, "liters": 1, "litre": 1,
        "ml": 0.001, "milliliter": 0.001, "milliliters": 0.001,
        "m3": 1000, "cubic_meter": 1000,
        "cm3": 0.001, "cc": 0.001,
        "gallon": 3.78541, "gallons": 3.78541, "gal": 3.78541,
        "quart": 0.946353, "quarts": 0.946353,
        "pint": 0.473176, "pints": 0.473176, "pt": 0.473176,
        "cup": 0.236588, "cups": 0.236588,
        "fl_oz": 0.0295735, "fluid_ounce": 0.0295735,
        "tbsp": 0.0147868, "tablespoon": 0.0147868,
        "tsp": 0.00492892, "teaspoon": 0.00492892,
    },
}

_TEMP_UNITS = {"celsius", "c", "fahrenheit", "f", "kelvin", "k"}


def _convert_temperature(value: float, from_u: str, to_u: str) -> float:
    # Normalize to Celsius first
    f = from_u.lower()
    t = to_u.lower()
    if f in ("celsius", "c"):
        c = value
    elif f in ("fahrenheit", "f"):
        c = (value - 32) * 5 / 9
    elif f in ("kelvin", "k"):
        c = value - 273.15
    else:
        raise ValueError(f"Unknown temperature unit: {from_u}")

    if t in ("celsius", "c"):
        return c
    elif t in ("fahrenheit", "f"):
        return c * 9 / 5 + 32
    elif t in ("kelvin", "k"):
        return c + 273.15
    else:
        raise ValueError(f"Unknown temperature unit: {to_u}")


async def unit_convert(value: float, from_unit: str, to_unit: str) -> dict[str, Any]:
    """Convert between units of measurement."""
    fu = from_unit.lower().strip()
    tu = to_unit.lower().strip()

    # Temperature is special (not multiplicative)
    if fu in _TEMP_UNITS or tu in _TEMP_UNITS:
        try:
            result = _convert_temperature(value, fu, tu)
            return {
                "value": value,
                "from_unit": from_unit,
                "to_unit": to_unit,
                "result": round(result, 6),
            }
        except ValueError as e:
            return {"error": str(e)}

    # Find category
    for category, units in _CONVERSIONS.items():
        if fu in units and tu in units:
            base_value = value * units[fu]
            result = base_value / units[tu]
            return {
                "value": value,
                "from_unit": from_unit,
                "to_unit": to_unit,
                "result": result,
                "category": category,
            }

    return {
        "error": f"Cannot convert '{from_unit}' to '{to_unit}'. Units may be incompatible or unsupported."
    }
