"""
Cure AI — Simulated Health Data Engine
Generates realistic time-series health data with injected anomalies.
"""

import numpy as np
import random
from datetime import datetime, timedelta
from typing import Dict, List, Any

# ─── Constants ────────────────────────────────────────────────────────────────

SIGNAL_CONFIGS = {
    "heart_rate": {
        "baseline": 68,
        "std": 5,
        "unit": "bpm",
        "normal_range": (55, 90),
        "label": "Heart Rate",
    },
    "sleep_hours": {
        "baseline": 7.2,
        "std": 0.6,
        "unit": "hrs",
        "normal_range": (6.0, 9.0),
        "label": "Sleep Duration",
    },
    "activity_steps": {
        "baseline": 8200,
        "std": 1200,
        "unit": "steps",
        "normal_range": (4000, 15000),
        "label": "Activity Level",
    },
    "body_temp": {
        "baseline": 36.8,
        "std": 0.2,
        "unit": "°C",
        "normal_range": (36.1, 37.5),
        "label": "Body Temperature",
    },
    "screen_time": {
        "baseline": 5.5,
        "std": 1.0,
        "unit": "hrs",
        "normal_range": (1.0, 9.0),
        "label": "Screen Time",
    },
    "hrv": {
        "baseline": 55,
        "std": 8,
        "unit": "ms",
        "normal_range": (30, 90),
        "label": "HRV",
    },
    "spo2": {
        "baseline": 98.0,
        "std": 0.5,
        "unit": "%",
        "normal_range": (95.0, 100.0),
        "label": "SpO2",
    },
}

ANOMALY_PATTERNS = [
    "fatigue",
    "infection",
    "stress",
    "none",
    "none",
    "none",
]


def _smooth_series(data: np.ndarray, window: int = 3) -> np.ndarray:
    """Apply simple moving average smoothing."""
    kernel = np.ones(window) / window
    return np.convolve(data, kernel, mode="same")


def generate_signal(signal_key: str, n_points: int = 48, anomaly: str = "none") -> List[float]:
    """Generate a single health signal time series with optional anomaly injection."""
    cfg = SIGNAL_CONFIGS[signal_key]
    baseline = cfg["baseline"]
    std = cfg["std"]

    # Base signal: random walk around baseline
    noise = np.random.normal(0, std * 0.4, n_points)
    drift = np.cumsum(np.random.normal(0, std * 0.08, n_points))
    series = baseline + noise + drift * 0.15

    # Inject anomaly in the last 30% of the series
    anomaly_start = int(n_points * 0.70)

    if anomaly == "fatigue":
        if signal_key == "heart_rate":
            series[anomaly_start:] += np.linspace(0, std * 1.8, n_points - anomaly_start)
        elif signal_key == "sleep_hours":
            series[anomaly_start:] -= np.linspace(0, std * 2.2, n_points - anomaly_start)
        elif signal_key == "activity_steps":
            series[anomaly_start:] -= np.linspace(0, std * 2.5, n_points - anomaly_start)
        elif signal_key == "hrv":
            series[anomaly_start:] -= np.linspace(0, std * 2.0, n_points - anomaly_start)

    elif anomaly == "infection":
        if signal_key == "body_temp":
            series[anomaly_start:] += np.linspace(0, std * 4.0, n_points - anomaly_start)
        elif signal_key == "heart_rate":
            series[anomaly_start:] += np.linspace(0, std * 2.5, n_points - anomaly_start)
        elif signal_key == "activity_steps":
            series[anomaly_start:] -= np.linspace(0, std * 3.0, n_points - anomaly_start)
        elif signal_key == "spo2":
            series[anomaly_start:] -= np.linspace(0, std * 2.0, n_points - anomaly_start)

    elif anomaly == "stress":
        if signal_key == "screen_time":
            series[anomaly_start:] += np.linspace(0, std * 2.5, n_points - anomaly_start)
        elif signal_key == "heart_rate":
            series[anomaly_start:] += np.linspace(0, std * 1.5, n_points - anomaly_start)
        elif signal_key == "sleep_hours":
            series[anomaly_start:] -= np.linspace(0, std * 1.5, n_points - anomaly_start)
        elif signal_key == "hrv":
            series[anomaly_start:] -= np.linspace(0, std * 1.8, n_points - anomaly_start)

    # Add a little noise on top
    series += np.random.normal(0, std * 0.15, n_points)

    # Smooth
    series = _smooth_series(series, window=3)

    # Clip to sensible ranges
    low, high = cfg["normal_range"]
    margin = (high - low) * 0.3
    series = np.clip(series, low - margin, high + margin)

    return [round(float(v), 2) for v in series]


def generate_timestamps(n_points: int = 48) -> List[str]:
    """Generate ISO timestamp strings for the last n_points * 30 min."""
    now = datetime.utcnow().replace(minute=0, second=0, microsecond=0)
    interval = timedelta(minutes=30)
    start = now - interval * (n_points - 1)
    ts = [start + interval * i for i in range(n_points)]
    return [t.strftime("%H:%M") for t in ts]


def generate_health_data(anomaly: str = None) -> Dict[str, Any]:
    """Generate a full set of health signals. Anomaly is chosen randomly if not set."""
    if anomaly is None:
        anomaly = random.choice(ANOMALY_PATTERNS)

    n_points = 48
    timestamps = generate_timestamps(n_points)

    signals = {}
    for key in SIGNAL_CONFIGS:
        signals[key] = generate_signal(key, n_points, anomaly)

    return {
        "timestamps": timestamps,
        "signals": signals,
        "active_anomaly": anomaly,
        "signal_configs": SIGNAL_CONFIGS,
    }


def get_current_vitals(data: Dict[str, Any]) -> Dict[str, Any]:
    """Extract the most recent value for each signal."""
    signals = data["signals"]
    configs = data["signal_configs"]
    vitals = {}
    for key, values in signals.items():
        cfg = configs[key]
        current = values[-1]
        prev = values[-6] if len(values) >= 6 else values[0]
        delta = current - prev
        pct_change = (delta / abs(prev)) * 100 if prev != 0 else 0
        low, high = cfg["normal_range"]
        vitals[key] = {
            "label": cfg["label"],
            "value": current,
            "unit": cfg["unit"],
            "delta": round(delta, 2),
            "pct_change": round(pct_change, 1),
            "trend": "up" if delta > 0 else "down" if delta < 0 else "stable",
            "in_range": low <= current <= high,
        }
    return vitals
