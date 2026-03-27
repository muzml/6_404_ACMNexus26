"""
Cure AI — Health Risk Scoring Engine
Converts multi-signal anomaly data into a 0–100 composite risk score.
"""

from typing import Dict, Any, List

# Weight of each signal's contribution to overall risk score
SIGNAL_WEIGHTS = {
    "heart_rate": 0.20,
    "sleep_hours": 0.18,
    "activity_steps": 0.14,
    "body_temp": 0.22,
    "screen_time": 0.08,
    "hrv": 0.12,
    "spo2": 0.06,
}

RISK_LEVELS = [
    (0, 33, "Low", "#4ade80", "Your vitals are within normal ranges."),
    (34, 66, "Medium", "#f59e0b", "Some signals show mild deviations. Monitor closely."),
    (67, 100, "High", "#ef4444", "Multiple signals indicate elevated health risk."),
]


def compute_risk_score(anomaly_results: Dict[str, Any]) -> Dict[str, Any]:
    """Compute a 0–100 risk score from anomaly detection results."""
    per_signal = anomaly_results["per_signal"]
    weighted_score = 0.0
    total_weight = 0.0
    contributing = []

    for signal_key, result in per_signal.items():
        weight = SIGNAL_WEIGHTS.get(signal_key, 0.10)
        severity = result["severity"]  # 0–1
        contribution = weight * severity * 100
        weighted_score += contribution
        total_weight += weight

        if result["is_anomalous"]:
            contributing.append({
                "signal": signal_key,
                "severity": result["severity"],
                "direction": result["direction"],
                "pct_deviation": result["pct_deviation"],
                "contribution": round(contribution, 1),
            })

    # Normalize to 0–100
    raw_score = weighted_score / total_weight if total_weight > 0 else 0
    score = min(100, round(raw_score, 1))

    # Determine risk level
    level = "Low"
    color = "#4ade80"
    description = "Your vitals are within normal ranges."
    for lo, hi, lv, cl, desc in RISK_LEVELS:
        if lo <= score <= hi:
            level = lv
            color = cl
            description = desc
            break

    # Sort contributing signals by contribution (highest first)
    contributing.sort(key=lambda x: x["contribution"], reverse=True)

    return {
        "score": score,
        "level": level,
        "color": color,
        "description": description,
        "contributing_signals": contributing,
        "anomaly_count": anomaly_results["anomaly_count"],
    }
