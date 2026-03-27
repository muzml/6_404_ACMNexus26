import React from 'react';
import { AlertTriangle, ShieldAlert, Info } from 'lucide-react';

const SEVERITY_STYLES = {
  high:   { border: 'rgba(255,77,109,0.25)', bg: 'rgba(255,77,109,0.05)', color: '#ff4d6d', icon: ShieldAlert },
  medium: { border: 'rgba(245,158,11,0.25)', bg: 'rgba(245,158,11,0.05)', color: '#f59e0b', icon: AlertTriangle },
  low:    { border: 'rgba(96,165,250,0.25)', bg: 'rgba(96,165,250,0.05)', color: '#60a5fa', icon: Info },
};

function AlertCard({ alert, index }) {
  const sty = SEVERITY_STYLES[alert.severity] || SEVERITY_STYLES.low;
  const Icon = sty.icon;

  return (
    <div style={{
      ...styles.alertCard,
      borderColor: sty.border,
      background: sty.bg,
      animationDelay: `${index * 0.08}s`,
      boxShadow: alert.severity === 'high' ? `0 0 20px ${sty.color}18` : 'none',
    }}>
      {/* Header */}
      <div style={styles.alertHeader}>
        <span style={styles.alertEmoji}>{alert.icon || '⚠️'}</span>
        <div style={styles.alertTitleGroup}>
          <span style={{ ...styles.alertName, color: sty.color }}>
            {alert.name}
          </span>
          <span style={styles.alertCategory}>{alert.category}</span>
        </div>
        <div style={styles.confidenceTag}>
          <Icon size={10} color={sty.color} />
          <span style={{ color: sty.color }}>{alert.confidence}%</span>
        </div>
      </div>

      {/* Explanation */}
      <p style={styles.explanation}>{alert.explanation}</p>

      {/* Confidence bar */}
      <div style={styles.confBar}>
        <div style={{
          ...styles.confFill,
          width: `${alert.confidence}%`,
          background: `linear-gradient(90deg, ${sty.color}80, ${sty.color})`,
        }} />
      </div>

      {/* Contributing signals */}
      <div style={styles.signals}>
        {alert.contributing_signals?.map(sig => (
          <span key={sig} style={{ ...styles.sigChip, borderColor: sty.border, color: sty.color }}>
            {sig.replace(/_/g, ' ')}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function RiskSignals({ alerts }) {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.sectionBar} />
        <span style={styles.title}>Risk Signals</span>
        {alerts.length > 0 && (
          <span style={styles.countBadge}>{alerts.length} active</span>
        )}
      </div>

      <div style={styles.list}>
        {alerts.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>✅</div>
            <p style={styles.emptyText}>No risk signals detected</p>
            <p style={styles.emptySubtext}>All health signals are within normal ranges</p>
          </div>
        ) : (
          alerts.map((alert, i) => (
            <AlertCard key={alert.id} alert={alert} index={i} />
          ))
        )}
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
    overflow: 'hidden',
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
    background: '#ff4d6d',
    borderRadius: 2,
    flexShrink: 0,
  },
  title: {
    fontSize: 15,
    fontWeight: 700,
    color: '#f0f2ff',
    flex: 1,
  },
  countBadge: {
    padding: '3px 10px',
    borderRadius: 20,
    background: 'rgba(255,77,109,0.12)',
    border: '1px solid rgba(255,77,109,0.2)',
    color: '#ff4d6d',
    fontSize: 11,
    fontWeight: 700,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    overflowY: 'auto',
    maxHeight: 380,
  },
  alertCard: {
    border: '1px solid',
    borderRadius: 12,
    padding: '12px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    animation: 'fadeInUp 0.4s ease both',
    transition: 'all 0.2s ease',
  },
  alertHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  alertEmoji: {
    fontSize: 18,
    flexShrink: 0,
  },
  alertTitleGroup: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },
  alertName: {
    fontSize: 13,
    fontWeight: 700,
  },
  alertCategory: {
    fontSize: 10,
    color: '#4a5280',
    textTransform: 'capitalize',
    letterSpacing: '0.06em',
  },
  confidenceTag: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 12,
    fontWeight: 700,
  },
  explanation: {
    fontSize: 12,
    color: '#8892b0',
    lineHeight: 1.5,
  },
  confBar: {
    height: 3,
    background: 'rgba(255,255,255,0.06)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  confFill: {
    height: '100%',
    borderRadius: 2,
    transition: 'width 0.8s ease',
  },
  signals: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 5,
  },
  sigChip: {
    padding: '2px 8px',
    borderRadius: 4,
    border: '1px solid',
    fontSize: 10,
    fontWeight: 600,
    textTransform: 'capitalize',
    background: 'rgba(255,255,255,0.03)',
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 0',
    gap: 8,
  },
  emptyIcon: {
    fontSize: 36,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: 600,
    color: '#4ade80',
  },
  emptySubtext: {
    fontSize: 12,
    color: '#4a5280',
    textAlign: 'center',
  },
};
