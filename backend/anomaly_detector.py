"""
Cure AI — Anomaly Detection Engine
Uses Z-score and rolling statistics to detect signal anomalies.
"""

import numpy as np
from typing import Dict, List, Any


Z_THRESHOLD = 1.8  # Signals beyond this are flagged
RECENT_WINDOW = 12  # Last 12 data points (6 hours at 30-min intervals) for comparison


def compute_z_scores(series: List[float]) -> np.ndarray:
    """Compute Z-scores for a series using the full historical window."""
    arr = np.array(series, dtype=float)
    mean = np.mean(arr)
    std = np.std(arr)
    if std < 1e-9:
        return np.zeros_like(arr)
    return (arr - mean) / std


def compute_rolling_mean(series: List[float], window: int = 8) -> np.ndarray:
    """Compute rolling mean for trend detection."""
    arr = np.array(series, dtype=float)
    result = np.full_like(arr, np.nan)
    for i in range(window - 1, len(arr)):
        result[i] = np.mean(arr[i - window + 1 : i + 1])
    return result


def detect_signal_anomalies(key: str, series: List[float]) -> Dict[str, Any]:
    """Analyze a single signal for anomalies."""
    arr = np.array(series, dtype=float)
    z_scores = compute_z_scores(series)

    # Focus on recent window
    recent_z = z_scores[-RECENT_WINDOW:]
    recent_vals = arr[-RECENT_WINDOW:]

    max_abs_z = float(np.max(np.abs(recent_z)))
    mean_recent = float(np.mean(recent_vals))
    mean_baseline = float(np.mean(arr[: -RECENT_WINDOW]))

    is_anomalous = max_abs_z >= Z_THRESHOLD

    # Direction: positive = rising, negative = falling
    direction = "rising" if mean_recent > mean_baseline else "falling"
    severity = min(1.0, max_abs_z / (Z_THRESHOLD * 2))  # 0–1 severity

    return {
        "signal": key,
        "is_anomalous": is_anomalous,
        "max_z_score": round(max_abs_z, 2),
        "severity": round(severity, 3),
        "direction": direction,
        "mean_recent": round(mean_recent, 2),
        "mean_baseline": round(mean_baseline, 2),
        "pct_deviation": round(((mean_recent - mean_baseline) / abs(mean_baseline)) * 100, 1)
            if mean_baseline != 0 else 0.0,
        "z_series": [round(float(z), 3) for z in z_scores],
    }


def detect_all_anomalies(signals: Dict[str, List[float]]) -> Dict[str, Any]:
    """Run anomaly detection across all signals."""
    results = {}
    anomalous_signals = []

    for key, series in signals.items():
        result = detect_signal_anomalies(key, series)
        results[key] = result
        if result["is_anomalous"]:
            anomalous_signals.append(key)

    return {
        "per_signal": results,
        "anomalous_signals": anomalous_signals,
        "anomaly_count": len(anomalous_signals),
    }
