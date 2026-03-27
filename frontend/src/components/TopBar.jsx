import React from 'react';
import { RefreshCw, Wifi, WifiOff, Clock } from 'lucide-react';

export default function TopBar({ lastUpdated, loading, onRefresh }) {
  const timeStr = lastUpdated
    ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '--:--:--';

  return (
    <header style={styles.topbar}>
      {/* Left: Title */}
      <div style={styles.left}>
        <div style={styles.dot} />
        <span style={styles.title}>Vital Dashboard</span>
        <span style={styles.subtitle}>Real-time health monitoring & AI risk analysis</span>
      </div>

      {/* Center: Status */}
      <div style={styles.statusRow}>
        <div style={{ ...styles.statusBadge, ...(loading ? styles.statusLoading : styles.statusLive) }}>
          {loading ? <WifiOff size={11} /> : <Wifi size={11} />}
          <span>{loading ? 'Syncing...' : 'Live'}</span>
        </div>
        <div style={styles.timeRow}>
          <Clock size={12} color="#4a5280" />
          <span style={styles.timeText}>{timeStr}</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div style={styles.right}>
        <button
          style={{ ...styles.refreshBtn, ...(loading ? styles.refreshBtnActive : {}) }}
          onClick={onRefresh}
          title="Refresh data"
        >
          <RefreshCw size={14} style={{ animation: loading ? 'spin-slow 0.8s linear infinite' : 'none' }} />
          <span>Refresh</span>
        </button>
      </div>
    </header>
  );
}

const styles = {
  topbar: {
    height: 58,
    background: '#0a0c15',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px',
    gap: 20,
    flexShrink: 0,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#c8f135',
    boxShadow: '0 0 8px rgba(200,241,53,0.6)',
    flexShrink: 0,
    animation: 'blink 2.5s ease-in-out infinite',
  },
  title: {
    fontSize: 15,
    fontWeight: 700,
    color: '#f0f2ff',
    fontFamily: "'Space Grotesk', sans-serif",
  },
  subtitle: {
    fontSize: 12,
    color: '#4a5280',
  },
  statusRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    padding: '4px 10px',
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
  },
  statusLive: {
    background: 'rgba(74,222,128,0.12)',
    color: '#4ade80',
    border: '1px solid rgba(74,222,128,0.2)',
  },
  statusLoading: {
    background: 'rgba(245,158,11,0.12)',
    color: '#f59e0b',
    border: '1px solid rgba(245,158,11,0.2)',
  },
  timeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
  },
  timeText: {
    fontSize: 12,
    color: '#4a5280',
    fontVariantNumeric: 'tabular-nums',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  refreshBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '7px 14px',
    borderRadius: 8,
    border: '1px solid rgba(200,241,53,0.2)',
    background: 'rgba(200,241,53,0.06)',
    color: '#c8f135',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 600,
    transition: 'all 0.15s ease',
  },
  refreshBtnActive: {
    background: 'rgba(200,241,53,0.12)',
  },
};
