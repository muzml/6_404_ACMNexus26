import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

const SEVERITY_COLOR = {
  high:   { bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)',   text: '#ef4444', badge: 'HIGH' },
  medium: { bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.3)',  text: '#fbbf24', badge: 'MEDIUM' },
  low:    { bg: 'rgba(74,222,128,0.1)',  border: 'rgba(74,222,128,0.3)',  text: '#4ade80', badge: 'LOW' },
};

function AlertCard({ alert }) {
  const [expanded, setExpanded] = useState(false);
  const s = SEVERITY_COLOR[alert.severity] ?? SEVERITY_COLOR.low;

  return (
    <div style={{
      background: s.bg,
      border: `1px solid ${s.border}`,
      borderRadius: 14,
      overflow: 'hidden',
      transition: 'all 0.2s',
    }}>
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          width: '100%', background: 'none', border: 'none',
          padding: '18px 20px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 14,
        }}
      >
        <span style={{ fontSize: 22 }}>{alert.icon}</span>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f2ff' }}>{alert.name}</div>
          <div style={{ fontSize: 12, color: '#4a5280', marginTop: 2 }}>
            Confidence: {alert.confidence?.toFixed(1)}%
          </div>
        </div>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
          color: s.text, background: `${s.text}18`,
          border: `1px solid ${s.border}`,
          padding: '3px 10px', borderRadius: 20, marginRight: 8,
        }}>
          {s.badge}
        </span>
        {expanded ? <ChevronUp size={16} color="#4a5280" /> : <ChevronDown size={16} color="#4a5280" />}
      </button>

      {expanded && (
        <div style={{ padding: '0 20px 18px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ fontSize: 13, color: '#8892b0', lineHeight: 1.6, margin: '14px 0 12px' }}>
            {alert.explanation}
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {(alert.contributing_signals ?? []).map(sig => (
              <span key={sig} style={{
                fontSize: 11, color: s.text,
                background: s.bg, border: `1px solid ${s.border}`,
                padding: '3px 10px', borderRadius: 20,
              }}>
                {sig.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const FILTERS = ['All', 'High', 'Medium', 'Low'];

export default function AlertsPage({ alerts = [] }) {
  const [filter, setFilter] = useState('All');
  const filtered = filter === 'All' ? alerts : alerts.filter(a => a.severity === filter.toLowerCase());

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f0f2ff', margin: 0 }}>Risk Alerts</h2>
          <p style={{ fontSize: 13, color: '#4a5280', marginTop: 4 }}>
            {alerts.length} active risk signal{alerts.length !== 1 ? 's' : ''} detected
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '7px 16px', borderRadius: 20, border: '1px solid',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              background: filter === f ? 'rgba(200,241,53,0.12)' : 'transparent',
              borderColor: filter === f ? 'rgba(200,241,53,0.4)' : 'rgba(255,255,255,0.08)',
              color: filter === f ? '#c8f135' : '#4a5280',
              transition: 'all 0.15s',
            }}>{f}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#4a5280' }}>
          <ShieldCheck size={48} style={{ margin: '0 auto 16px', display: 'block', opacity: 0.4 }} />
          <p style={{ fontSize: 14 }}>No {filter !== 'All' ? filter.toLowerCase() : ''} alerts found</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(a => <AlertCard key={a.id} alert={a} />)}
        </div>
      )}
    </div>
  );
}
