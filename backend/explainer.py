"""
Cure AI — Explainable AI Engine
Pattern-matches anomalies to human-readable health insights.
"""

from typing import Dict, Any, List


# ─── Pattern Library ─────────────────────────────────────────────────────────

PATTERNS = [
    {
        "id": "early_fatigue",
        "name": "Early Fatigue Detected",
        "icon": "🔴",
        "trigger_signals": {"heart_rate": "rising", "sleep_hours": "falling", "activity_steps": "falling"},
        "required_matches": 2,
        "explanation_template": (
            "Sleep decreased by {sleep_pct}%, resting heart rate increased by {hr_pct}%, "
            "and activity dropped — indicating early fatigue risk."
        ),
        "severity_weight": 0.85,
        "category": "fatigue",
    },
    {
        "id": "possible_infection",
        "name": "Possible Infection Trend",
        "icon": "🟠",
        "trigger_signals": {"body_temp": "rising", "heart_rate": "rising", "activity_steps": "falling"},
        "required_matches": 2,
        "explanation_template": (
            "Body temperature trending upward by {temp_pct}%, heart rate elevated by {hr_pct}% — "
            "combined with reduced activity, this may indicate early infection or illness."
        ),
        "severity_weight": 0.90,
        "category": "infection",
    },
    {
        "id": "stress_pattern",
        "name": "Stress Pattern Identified",
        "icon": "🟡",
        "trigger_signals": {"screen_time": "rising", "heart_rate": "rising", "sleep_hours": "falling"},
        "required_matches": 2,
        "explanation_template": (
            "Screen time increased by {screen_pct}%, sleep reduced, and heart rate elevated — "
            "consistent with chronic stress and sleep disruption patterns."
        ),
        "severity_weight": 0.75,
        "category": "stress",
    },
    {
        "id": "low_activity_risk",
        "name": "Sedentary Behavior Alert",
        "icon": "⚪",
        "trigger_signals": {"activity_steps": "falling", "screen_time": "rising"},
        "required_matches": 2,
        "explanation_template": (
            "Physical activity dropped significantly while screen time rose — "
            "prolonged sedentary behavior increases cardiovascular risk."
        ),
        "severity_weight": 0.55,
        "category": "lifestyle",
    },
    {
        "id": "hrv_drop",
        "name": "HRV Decline Warning",
        "icon": "🔵",
        "trigger_signals": {"hrv": "falling", "heart_rate": "rising"},
        "required_matches": 2,
        "explanation_template": (
            "Heart Rate Variability dropped by {hrv_pct}%, while resting heart rate rose — "
            "indicating reduced autonomic recovery and higher cardiovascular load."
        ),
        "severity_weight": 0.70,
        "category": "cardiovascular",
    },
]


def _get_pct(per_signal: Dict, key: str) -> str:
    """Safely extract pct_deviation as a formatted string."""
    if key in per_signal:
        val = abs(per_signal[key].get("pct_deviation", 0))
        return str(round(val, 1))
    return "N/A"


def generate_alerts(anomaly_results: Dict[str, Any], risk_score: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Match anomaly patterns to alert templates and generate explainable alerts."""
    per_signal = anomaly_results["per_signal"]
    alerts = []

    for pattern in PATTERNS:
        matches = 0
        matched_signals = []

        for sig_key, expected_direction in pattern["trigger_signals"].items():
            sig_data = per_signal.get(sig_key, {})
            if sig_data.get("is_anomalous") and sig_data.get("direction") == expected_direction:
                matches += 1
                matched_signals.append(sig_key)

        if matches >= pattern["required_matches"]:
            # Build explanation with filled template values
            try:
                explanation = pattern["explanation_template"].format(
                    sleep_pct=_get_pct(per_signal, "sleep_hours"),
                    hr_pct=_get_pct(per_signal, "heart_rate"),
                    temp_pct=_get_pct(per_signal, "body_temp"),
                    screen_pct=_get_pct(per_signal, "screen_time"),
                    hrv_pct=_get_pct(per_signal, "hrv"),
                    activity_pct=_get_pct(per_signal, "activity_steps"),
                )
            except KeyError:
                explanation = "Multiple abnormal signals detected across health metrics."

            # Confidence = fraction of trigger signals matched × severity_weight
            confidence = min(0.98, (matches / len(pattern["trigger_signals"])) * pattern["severity_weight"] + 0.15)

            alerts.append({
                "id": pattern["id"],
                "name": pattern["name"],
                "icon": pattern["icon"],
                "category": pattern["category"],
                "explanation": explanation,
                "confidence": round(confidence * 100, 1),
                "contributing_signals": matched_signals,
                "severity": "high" if confidence > 0.75 else "medium" if confidence > 0.55 else "low",
            })

    # Sort by confidence descending
    alerts.sort(key=lambda x: x["confidence"], reverse=True)
    return alerts


def generate_recommendations(alerts: List[Dict], risk_score: Dict) -> List[Dict[str, Any]]:
    """Generate actionable health recommendations based on active alerts."""
    level = risk_score.get("level", "Low")
    categories = {a["category"] for a in alerts}

    recs = []

    if "fatigue" in categories or level in ("Medium", "High"):
        recs.append({
            "icon": "😴",
            "title": "Prioritize Sleep",
            "detail": "Aim for 7–9 hours tonight. Avoid screens 1 hour before bedtime to improve sleep quality.",
        })
    if "infection" in categories:
        recs.append({
            "icon": "💧",
            "title": "Stay Hydrated",
            "detail": "Drink at least 2.5L of water today. Elevated temperature increases fluid loss.",
        })
    if "stress" in categories:
        recs.append({
            "icon": "🧘",
            "title": "Take Mindful Breaks",
            "detail": "5–10 min of deep breathing or meditation can reduce cortisol and lower heart rate.",
        })
    if "lifestyle" in categories or "activity_steps" in {s for a in alerts for s in a["contributing_signals"]}:
        recs.append({
            "icon": "🚶",
            "title": "Light Movement Recommended",
            "detail": "A 20-min walk can boost mood, circulation, and counteract sedentary behavior.",
        })
    if "cardiovascular" in categories:
        recs.append({
            "icon": "❤️",
            "title": "Monitor Heart Rate Variability",
            "detail": "Low HRV may indicate stress or recovery deficit. Consider light exercise and rest today.",
        })

    # Always include a general tip
    recs.append({
        "icon": "🥗",
        "title": "Balanced Nutrition",
        "detail": "Include anti-inflammatory foods (greens, omega-3s, berries) to support immune function.",
    })

    return recs[:5]  # Max 5 recommendations
