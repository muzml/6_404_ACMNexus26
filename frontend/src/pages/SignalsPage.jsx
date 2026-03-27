import React, { useState } from 'react';
import SignalStreams from '../components/SignalStreams';

const SIGNALS = [
  { key: 'heart_rate',     label: 'Heart Rate',    unit: 'bpm',   color: '#ef4444' },
  { key: 'sleep_hours',    label: 'Sleep',         unit: 'hrs',   color: '#818cf8' },
  { key: 'activity_steps', label: 'Activity',      unit: 'steps', color: '#facc15' },
  { key: 'body_temp',      label: 'Body Temp',     unit: '°C',    color: '#fb923c' },
  { key: 'screen_time',    label: 'Screen Time',   unit: 'hrs',   color: '#34d399' },
  { key: 'hrv',            label: 'HRV',           unit: 'ms',    color: '#f472b6' },
  { key: 'spo2',           label: 'SpO₂',          unit: '%',     color: '#38bdf8' },
];

function StatPill({ sig, signals }) {
  const vals = signals?.[sig.key] ?? [];
  const last = vals[vals.length - 1];
  const avg = vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : '—';
  const min = vals.length ? Math.min(...vals).toFixed(1) : '—';
  const max = vals.length ? Math.max(...vals).toFixed(1) : '—';

  return (
    <div style={{
      background: '#0d1020',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 14,
      padding: '16px 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: sig.color, boxShadow: `0 0 6px ${sig.color}80` }} />
        <span style={{ fontSize: 12, color: '#8892b0', fontWeight: 600 }}>{sig.label}</span>
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: sig.color, fontFamily: "'Space Grotesk', sans-serif" }}>
        {last != null ? last.toFixed(1) : '—'}
        <span style={{ fontSize: 12, color: '#4a5280', fontWeight: 400, marginLeft: 4 }}>{sig.unit}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
        {[['Min', min], ['Avg', avg], ['Max', max]].map(([lbl, val]) => (
          <div key={lbl} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '5px 0' }}>
            <div style={{ fontSize: 10, color: '#4a5280' }}>{lbl}</div>
            <div style={{ fontSize: 12, color: '#8892b0', fontWeight: 600 }}>{val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SignalsPage({ timestamps, signals }) {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f0f2ff', margin: 0 }}>Signal Streams</h2>
        <p style={{ fontSize: 13, color: '#4a5280', marginTop: 4 }}>
          Real-time biosignal data and historical trends
        </p>
      </div>

      <SignalStreams timestamps={timestamps} signals={signals} />

      <div style={{ marginTop: 20, marginBottom: 12 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#8892b0', margin: 0 }}>SIGNAL STATISTICS</h3>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 14,
      }}>
        {SIGNALS.map(sig => (
          <StatPill key={sig.key} sig={sig} signals={signals} />
        ))}
      </div>
    </div>
  );
}
