import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';

ChartJS.register(ArcElement, Tooltip);

const LEVEL_COLORS = {
  Low:    '#4ade80',
  Medium: '#f59e0b',
  High:   '#ef4444',
};

export default function RiskScore({ riskScore }) {
  const score = riskScore?.score ?? 0;
  const level = riskScore?.level ?? 'Low';
  const color = LEVEL_COLORS[level] || '#4ade80';
  const desc  = riskScore?.description ?? 'Analyzing...';
  const contributing = riskScore?.contributing_signals ?? [];

  const chartData = {
    datasets: [{
      data: [score, 100 - score],
      backgroundColor: [`${color}dd`, 'rgba(255,255,255,0.04)'],
      borderColor: ['transparent', 'transparent'],
      borderWidth: 0,
      circumference: 270,
      rotation: -135,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '76%',
    animation: { animateRotate: true, duration: 900 },
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.sectionBar} />
        <span style={styles.title}>Health Index</span>
        <span style={{
          ...styles.levelBadge,
          background: `${color}18`,
          color,
          borderColor: `${color}35`,
          boxShadow: level === 'High' ? `0 0 16px ${color}40` : 'none',
        }}>
          {level} Risk
        </span>
      </div>

      {/* Gauge */}
      <div style={styles.gaugeWrap}>
        <div style={styles.gaugeChart}>
          <Doughnut data={chartData} options={chartOptions} />
        </div>
        <div style={styles.gaugeCenter}>
          <div style={{ ...styles.scoreValue, color }}>{score}</div>
          <div style={styles.scoreLabel}>/ 100</div>
          <div style={{ ...styles.scoreLevel, color }}>{level}</div>
        </div>
      </div>

      {/* Description */}
      <p style={styles.desc}>{desc}</p>

      {/* Contributing signals */}
      {contributing.length > 0 && (
        <div style={styles.signalsSection}>
          <p style={styles.signalsLabel}>Contributing Factors</p>
          <div style={styles.signalsList}>
            {contributing.slice(0, 4).map(sig => (
              <div key={sig.signal} style={styles.sigRow}>
                <div style={styles.sigName}>{sig.signal.replace(/_/g, ' ')}</div>
                <div style={styles.sigBar}>
                  <div style={{
                    ...styles.sigFill,
                    width: `${Math.min(100, sig.severity * 100)}%`,
                    background: color,
                  }} />
                </div>
                <div style={{ ...styles.sigPct, color }}>
                  {sig.pct_deviation > 0 ? '+' : ''}{sig.pct_deviation}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Anomaly count */}
      <div style={styles.anomalyRow}>
        <span style={styles.anomalyDot} />
        <span style={styles.anomalyText}>
          {riskScore?.anomaly_count ?? 0} anomalous signal{(riskScore?.anomaly_count ?? 0) !== 1 ? 's' : ''} detected
        </span>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: '#12141f',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 18,
    padding: '20px',
    animation: 'fadeInUp 0.5s ease both',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  sectionBar: {
    display: 'block',
    width: 3,
    height: 16,
    background: '#c8f135',
    borderRadius: 2,
    flexShrink: 0,
  },
  title: {
    fontSize: 15,
    fontWeight: 700,
    color: '#f0f2ff',
    flex: 1,
  },
  levelBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '3px 10px',
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 700,
    border: '1px solid',
    letterSpacing: '0.04em',
  },
  gaugeWrap: {
    position: 'relative',
    height: 180,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeChart: {
    position: 'absolute',
    inset: 0,
  },
  gaugeCenter: {
    position: 'relative',
    textAlign: 'center',
    zIndex: 1,
    marginTop: 20,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 900,
    fontFamily: "'Space Grotesk', sans-serif",
    lineHeight: 1,
  },
  scoreLabel: {
    fontSize: 13,
    color: '#4a5280',
    fontWeight: 500,
  },
  scoreLevel: {
    fontSize: 13,
    fontWeight: 700,
    marginTop: 4,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  desc: {
    fontSize: 12,
    color: '#8892b0',
    lineHeight: 1.5,
    textAlign: 'center',
  },
  signalsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  signalsLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: '#4a5280',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  signalsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  sigRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  sigName: {
    width: 100,
    fontSize: 11,
    color: '#8892b0',
    textTransform: 'capitalize',
    flexShrink: 0,
  },
  sigBar: {
    flex: 1,
    height: 4,
    background: 'rgba(255,255,255,0.06)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  sigFill: {
    height: '100%',
    borderRadius: 2,
    transition: 'width 0.8s ease',
    opacity: 0.7,
  },
  sigPct: {
    width: 40,
    fontSize: 11,
    fontWeight: 600,
    textAlign: 'right',
    flexShrink: 0,
  },
  anomalyRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    paddingTop: 4,
    borderTop: '1px solid rgba(255,255,255,0.05)',
  },
  anomalyDot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: '#f59e0b',
    display: 'block',
    animation: 'blink 2s ease-in-out infinite',
  },
  anomalyText: {
    fontSize: 11,
    color: '#8892b0',
  },
};
