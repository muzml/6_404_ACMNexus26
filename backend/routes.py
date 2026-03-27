"""
Cure AI — FastAPI Routes
"""

from fastapi import APIRouter
from data_engine import generate_health_data, get_current_vitals
from anomaly_detector import detect_all_anomalies
from risk_scorer import compute_risk_score
from explainer import generate_alerts, generate_recommendations

router = APIRouter(prefix="/api")

# ─── Shared state (re-generated each request for demo variability) ────────────

def _get_full_analysis():
    data = generate_health_data()
    anomalies = detect_all_anomalies(data["signals"])
    risk = compute_risk_score(anomalies)
    alerts = generate_alerts(anomalies, risk)
    recs = generate_recommendations(alerts, risk)
    return data, anomalies, risk, alerts, recs


@router.get("/health-data")
def get_health_data():
    """Return 24h time-series data for all signals."""
    data, anomalies, risk, alerts, recs = _get_full_analysis()
    return {
        "timestamps": data["timestamps"],
        "signals": data["signals"],
        "active_anomaly": data["active_anomaly"],
    }


@router.get("/vitals")
def get_vitals():
    """Return current vital snapshot."""
    data, anomalies, risk, alerts, recs = _get_full_analysis()
    vitals = get_current_vitals(data)
    return {"vitals": vitals}


@router.get("/risk-score")
def get_risk_score():
    """Return composite health risk score."""
    data, anomalies, risk, alerts, recs = _get_full_analysis()
    return risk


@router.get("/alerts")
def get_alerts():
    """Return active health risk alerts with explanations."""
    data, anomalies, risk, alerts, recs = _get_full_analysis()
    return {"alerts": alerts, "count": len(alerts)}


@router.get("/recommendations")
def get_recommendations():
    """Return AI-generated health recommendations."""
    data, anomalies, risk, alerts, recs = _get_full_analysis()
    return {"recommendations": recs}


@router.get("/full-analysis")
def get_full_analysis():
    """Return all dashboard data in a single request (used by frontend)."""
    data, anomalies, risk, alerts, recs = _get_full_analysis()
    vitals = get_current_vitals(data)
    return {
        "timestamps": data["timestamps"],
        "signals": data["signals"],
        "active_anomaly": data["active_anomaly"],
        "vitals": vitals,
        "risk_score": risk,
        "alerts": alerts,
        "recommendations": recs,
        "anomaly_summary": {
            "anomalous_signals": anomalies["anomalous_signals"],
            "count": anomalies["anomaly_count"],
        },
    }
