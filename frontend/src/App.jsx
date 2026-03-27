import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import VitalDashboard from './components/VitalDashboard';
import SignalStreams from './components/SignalStreams';
import RiskScore from './components/RiskScore';
import RiskSignals from './components/RiskSignals';
import AIAssistant from './components/AIAssistant';
import './index.css';
import './App.css';

const API_BASE = 'http://localhost:8000/api';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/full-analysis`);
      const json = await res.json();
      setData(json);
      setLastUpdated(new Date());
      setLoading(false);
    } catch (err) {
      console.error('API error:', err);
      // Use demo data if backend is offline
      setData(generateDemoData());
      setLastUpdated(new Date());
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 6000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <div className="app-layout">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="main-area">
        <TopBar lastUpdated={lastUpdated} loading={loading} onRefresh={fetchData} />
        <main className="main-content">
          {loading ? (
            <LoadingState />
          ) : (
            <>
              <div className="dashboard-grid">
                <VitalDashboard vitals={data?.vitals} />
              </div>
              <SignalStreams
                timestamps={data?.timestamps}
                signals={data?.signals}
              />
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1.1fr',
                gap: 18,
                minHeight: 0,
              }}>
                <RiskSignals alerts={data?.alerts || []} />
                <AIAssistant recommendations={data?.recommendations || []} />
                <RiskScore riskScore={data?.risk_score} />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '60vh', flexDirection: 'column', gap: 16
    }}>
      <div style={{
        width: 48, height: 48, border: '3px solid #1c1f2e',
        borderTopColor: '#c8f135', borderRadius: '50%',
        animation: 'spin-slow 0.8s linear infinite'
      }} />
      <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
        Initializing health analysis...
      </p>
    </div>
  );
}

// Demo data for when backend is offline
function generateDemoData() {
  const n = 48;
  const ts = Array.from({ length: n }, (_, i) => {
    const t = new Date(Date.now() - (n - i) * 30 * 60000);
    return t.toTimeString().slice(0, 5);
  });
  const rand = (base, std) =>
    Array.from({ length: n }, () => +(base + (Math.random() - 0.5) * std * 2).toFixed(2));

  const signals = {
    heart_rate: rand(72, 6),
    sleep_hours: rand(6.8, 0.8),
    activity_steps: rand(7500, 1500),
    body_temp: rand(36.9, 0.3),
    screen_time: rand(6.2, 1.2),
    hrv: rand(52, 9),
    spo2: rand(97.8, 0.6),
  };

  // Inject fatigue at end
  for (let i = 34; i < n; i++) {
    signals.heart_rate[i] = +(signals.heart_rate[i] + (i - 34) * 0.4).toFixed(2);
    signals.sleep_hours[i] = +(signals.sleep_hours[i] - (i - 34) * 0.06).toFixed(2);
    signals.activity_steps[i] = +(signals.activity_steps[i] - (i - 34) * 80).toFixed(2);
  }

  return {
    timestamps: ts,
    signals,
    active_anomaly: 'fatigue',
    vitals: {
      heart_rate: { label: 'Heart Rate', value: 81, unit: 'bpm', trend: 'up', pct_change: 8.2, in_range: false },
      sleep_hours: { label: 'Sleep', value: 5.8, unit: 'hrs', trend: 'down', pct_change: -19.4, in_range: false },
      activity_steps: { label: 'Activity', value: 4200, unit: 'steps', trend: 'down', pct_change: -43.2, in_range: false },
      body_temp: { label: 'Body Temp', value: 37.0, unit: '°C', trend: 'stable', pct_change: 0.5, in_range: true },
      screen_time: { label: 'Screen Time', value: 7.1, unit: 'hrs', trend: 'up', pct_change: 22.4, in_range: true },
      hrv: { label: 'HRV', value: 44, unit: 'ms', trend: 'down', pct_change: -18.5, in_range: false },
      spo2: { label: 'SpO2', value: 97.4, unit: '%', trend: 'stable', pct_change: -0.4, in_range: true },
    },
    risk_score: { score: 71, level: 'High', color: '#ef4444', description: 'Multiple signals indicate elevated health risk.', contributing_signals: [], anomaly_count: 3 },
    alerts: [
      { id: 'early_fatigue', name: 'Early Fatigue Detected', icon: '🔴', category: 'fatigue', explanation: 'Sleep decreased by 19%, resting heart rate increased by 8%, and activity dropped — indicating early fatigue risk.', confidence: 87.5, contributing_signals: ['heart_rate', 'sleep_hours', 'activity_steps'], severity: 'high' },
      { id: 'hrv_drop', name: 'HRV Decline Warning', icon: '🔵', category: 'cardiovascular', explanation: 'Heart Rate Variability dropped by 18%, while resting heart rate rose — indicating reduced autonomic recovery.', confidence: 72.0, contributing_signals: ['hrv', 'heart_rate'], severity: 'medium' },
    ],
    recommendations: [
      { icon: '😴', title: 'Prioritize Sleep', detail: 'Aim for 7–9 hours tonight. Avoid screens 1 hour before bedtime.' },
      { icon: '💧', title: 'Stay Hydrated', detail: 'Drink at least 2.5L of water today. Proper hydration supports recovery.' },
      { icon: '🧘', title: 'Take Mindful Breaks', detail: '5–10 min of deep breathing can reduce cortisol and lower heart rate.' },
      { icon: '🚶', title: 'Light Movement', detail: 'A 20-min walk boosts mood, circulation, and counters sedentary patterns.' },
      { icon: '🥗', title: 'Balanced Nutrition', detail: 'Include anti-inflammatory foods (greens, omega-3s, berries).' },
    ],
  };
}

export default App;
