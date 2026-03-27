import React from 'react';
import {
  Heart, Moon, Footprints, Thermometer, Monitor, Activity, Droplets
} from 'lucide-react';

const ICON_MAP = {
  heart_rate:     { icon: Heart,       color: '#ff4d6d', bg: 'rgba(255,77,109,0.1)' },
  sleep_hours:    { icon: Moon,        color: '#9b6dff', bg: 'rgba(155,109,255,0.1)' },
  activity_steps: { icon: Footprints,  color: '#c8f135', bg: 'rgba(200,241,53,0.1)' },
  body_temp:      { icon: Thermometer, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  screen_time:    { icon: Monitor,     color: '#3df5c0', bg: 'rgba(61,245,192,0.1)' },
  hrv:            { icon: Activity,    color: '#ff8c42', bg: 'rgba(255,140,66,0.1)' },
  spo2:           { icon: Droplets,    color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
};

function Sparkline({ values, color }) {
  if (!values || values.length < 2) return null;
  const recent = values.slice(-20);
  const min = Math.min(...recent);
  const max = Math.max(...recent);
  const range = max - min || 1;
  const w = 80, h = 30;
  const pts = recent.map((v, i) => {
    const x = (i / (recent.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
    </svg>
  );
}

function VitalCard({ signalKey, vital, signals }) {
  const cfg = ICON_MAP[signalKey] || { icon: Activity, color: '#8892b0', bg: 'rgba(136,146,176,0.1)' };
  const Icon = cfg.icon;
  const isUp = vital?.trend === 'up';
  const isDown = vital?.trend === 'down';
  const isAbnormal = vital && !vital.in_range;

  return (
    <div style={{
      ...styles.card,
      borderColor: isAbnormal ? `${cfg.color}33` : 'rgba(255,255,255,0.06)',
      boxShadow: isAbnormal ? `0 0 20px ${cfg.color}15` : 'none',
    }}>
      {/* Header */}
      <div style={styles.header}>
        <div style={{ ...styles.iconWrap, background: cfg.bg }}>
          <Icon size={15} color={cfg.color} strokeWidth={2} />
        </div>
        <span style={styles.label}>{vital?.label || signalKey}</span>
        {isAbnormal && <div style={{ ...styles.alertDot, background: cfg.color }} />}
      </div>

      {/* Value */}
      <div style={styles.valueRow}>
        <span style={{ ...styles.value, color: isAbnormal ? cfg.color : '#f0f2ff' }}>
          {vital?.value ?? '—'}
        </span>
        <span style={styles.unit}>{vital?.unit ?? ''}</span>
      </div>

      {/* Change */}
      <div style={styles.changeRow}>
        <span style={{
          ...styles.arrow,
          color: isUp ? '#ef4444' : isDown ? '#4ade80' : '#8892b0'
        }}>
          {isUp ? '↑' : isDown ? '↓' : '→'}
        </span>
        <span style={{ ...styles.pct, color: isUp ? '#ef4444' : isDown ? '#4ade80' : '#8892b0' }}>
          {vital?.pct_change !== undefined ? `${Math.abs(vital.pct_change)}%` : ''}
        </span>
        <span style={styles.vs}>vs 3h ago</span>
      </div>

      {/* Sparkline */}
      <div style={styles.sparklineWrap}>
        <Sparkline values={signals?.[signalKey]} color={cfg.color} />
      </div>

      {/* Status bar */}
      <div style={styles.statusBar}>
        <div style={{
          ...styles.statusFill,
          width: isAbnormal ? '100%' : '40%',
          background: isAbnormal ? cfg.color : '#4ade80',
          opacity: isAbnormal ? 0.5 : 0.3,
        }} />
      </div>
    </div>
  );
}

export default function VitalDashboard({ vitals, signals }) {
  const keys = ['heart_rate', 'sleep_hours', 'activity_steps', 'body_temp', 'screen_time', 'hrv', 'spo2'];

  return (
    <div style={styles.grid}>
      {keys.map(key => (
        <VitalCard
          key={key}
          signalKey={key}
          vital={vitals?.[key]}
          signals={signals}
        />
      ))}
    </div>
  );
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: 12,
  },
  card: {
    background: '#12141f',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: '14px 14px 10px',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    transition: 'all 0.25s ease',
    cursor: 'default',
    animation: 'fadeInUp 0.4s ease both',
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    marginBottom: 2,
  },
  iconWrap: {
    width: 26,
    height: 26,
    borderRadius: 7,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  label: {
    fontSize: 11,
    fontWeight: 600,
    color: '#8892b0',
    flex: 1,
    letterSpacing: '0.02em',
  },
  alertDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    animation: 'blink 1.5s ease-in-out infinite',
  },
  valueRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: 800,
    fontFamily: "'Space Grotesk', sans-serif",
    lineHeight: 1,
  },
  unit: {
    fontSize: 11,
    color: '#4a5280',
    fontWeight: 500,
  },
  changeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 3,
  },
  arrow: {
    fontSize: 12,
    fontWeight: 700,
  },
  pct: {
    fontSize: 12,
    fontWeight: 600,
  },
  vs: {
    fontSize: 10,
    color: '#4a5280',
  },
  sparklineWrap: {
    marginTop: 4,
    height: 30,
  },
  statusBar: {
    height: 2,
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 4,
  },
  statusFill: {
    height: '100%',
    borderRadius: 2,
    transition: 'width 0.8s ease, background 0.5s ease',
  },
};
