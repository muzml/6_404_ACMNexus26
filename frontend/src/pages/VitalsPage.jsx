import React from 'react';
import { HeartPulse, Moon, Footprints, Thermometer, Monitor, Activity, Wind } from 'lucide-react';

const VITAL_META = [
  { key: 'heart_rate',     icon: HeartPulse,   color: '#ef4444', label: 'Heart Rate',      unit: 'bpm',   normal: '60–100',  desc: 'Resting beats per minute' },
  { key: 'sleep_hours',    icon: Moon,          color: '#818cf8', label: 'Sleep Duration',  unit: 'hrs',   normal: '7–9',     desc: 'Total nightly sleep' },
  { key: 'activity_steps', icon: Footprints,    color: '#facc15', label: 'Activity Level',  unit: 'steps', normal: '8000+',   desc: 'Daily step count' },
  { key: 'body_temp',      icon: Thermometer,   color: '#fb923c', label: 'Body Temperature',unit: '°C',    normal: '36.1–37.2', desc: 'Core body temperature' },
  { key: 'screen_time',    icon: Monitor,       color: '#34d399', label: 'Screen Time',     unit: 'hrs',   normal: '<6',      desc: 'Daily device usage' },
  { key: 'hrv',            icon: Activity,      color: '#f472b6', label: 'HRV',             unit: 'ms',    normal: '50–100',  desc: 'Heart Rate Variability' },
  { key: 'spo2',           icon: Wind,          color: '#38bdf8', label: 'SpO₂',            unit: '%',     normal: '95–100',  desc: 'Blood oxygen saturation' },
];

function TrendBadge({ trend, pct }) {
  const up   = trend === 'up';
  const down = trend === 'down';
  const color = up ? '#ef4444' : down ? '#4ade80' : '#94a3b8';
  const arrow = up ? '↑' : down ? '↓' : '→';
  return (
    <span style={{ fontSize: 12, color, fontWeight: 600 }}>
      {arrow} {Math.abs(pct ?? 0).toFixed(1)}%
    </span>
  );
}

function VitalCard({ meta, vital }) {
  const Icon = meta.icon;
  const inRange = vital?.in_range;
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0d1020 0%, #111428 100%)',
      border: `1px solid ${inRange ? 'rgba(255,255,255,0.07)' : 'rgba(239,68,68,0.25)'}`,
      borderRadius: 16,
      padding: '24px 22px',
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      position: 'relative',
      overflow: 'hidden',
      transition: 'transform 0.2s',
    }}>
      {/* Glowing accent */}
      <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 80, height: 80, borderRadius: '50%',
        background: meta.color, opacity: 0.08, filter: 'blur(20px)',
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: `${meta.color}18`,
          border: `1px solid ${meta.color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={18} color={meta.color} />
        </div>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
          color: inRange ? '#4ade80' : '#ef4444',
          background: inRange ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)',
          border: `1px solid ${inRange ? 'rgba(74,222,128,0.3)' : 'rgba(239,68,68,0.3)'}`,
          padding: '3px 8px', borderRadius: 20,
        }}>
          {inRange ? 'NORMAL' : 'OUT OF RANGE'}
        </span>
      </div>

      <div>
        <div style={{ fontSize: 11, color: '#4a5280', marginBottom: 4, fontWeight: 500 }}>
          {meta.label}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontSize: 32, fontWeight: 800, color: meta.color, fontFamily: "'Space Grotesk', sans-serif" }}>
            {vital?.value ?? '—'}
          </span>
          <span style={{ fontSize: 13, color: '#4a5280' }}>{meta.unit}</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TrendBadge trend={vital?.trend} pct={vital?.pct_change} />
        <span style={{ fontSize: 11, color: '#4a5280' }}>Normal: {meta.normal} {meta.unit}</span>
      </div>

      <div style={{
        fontSize: 11, color: '#4a5280', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10,
      }}>
        {meta.desc}
      </div>
    </div>
  );
}

export default function VitalsPage({ vitals }) {
  return (
    <div style={{ padding: '0 2px' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f0f2ff', margin: 0 }}>Vitals Overview</h2>
        <p style={{ fontSize: 13, color: '#4a5280', marginTop: 4 }}>
          Detailed view of all monitored health metrics
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 16,
      }}>
        {VITAL_META.map(meta => (
          <VitalCard key={meta.key} meta={meta} vital={vitals?.[meta.key]} />
        ))}
      </div>
    </div>
  );
}
