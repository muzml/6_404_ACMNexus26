import React from 'react';
import { Bell, AlertCircle, Info, CheckCircle, Clock } from 'lucide-react';

const NOTIFS = [
  { id: 1, type: 'alert',   icon: AlertCircle,   color: '#ef4444', title: 'High Risk Alert',          body: 'Early Fatigue Detected — multiple signals indicate elevated risk.',           time: '2m ago' },
  { id: 2, type: 'warning', icon: Bell,           color: '#fbbf24', title: 'HRV Below Threshold',      body: 'Your HRV has dropped below 50ms for the past 3 hours.',                       time: '18m ago' },
  { id: 3, type: 'info',    icon: Info,           color: '#38bdf8', title: 'Daily Summary Ready',      body: 'Your health summary for today is ready to review in the dashboard.',          time: '1h ago' },
  { id: 4, type: 'success', icon: CheckCircle,    color: '#4ade80', title: 'Step Goal Achieved',       body: 'You reached your step goal of 8,000 steps yesterday. Keep it up!',            time: '3h ago' },
  { id: 5, type: 'warning', icon: Bell,           color: '#fbbf24', title: 'Screen Time Exceeded',     body: 'You have exceeded your daily screen time limit of 6 hours.',                  time: '5h ago' },
  { id: 6, type: 'info',    icon: Info,           color: '#38bdf8', title: 'Weekly Report Available',  body: 'Your weekly health trend report is now available.',                           time: '1d ago' },
];

export default function NotificationsPage() {
  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f0f2ff', margin: 0 }}>Notifications</h2>
          <p style={{ fontSize: 13, color: '#4a5280', marginTop: 4 }}>
            Recent alerts and system updates
          </p>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 700, color: '#ef4444',
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          padding: '4px 12px', borderRadius: 20,
        }}>
          {NOTIFS.filter(n => n.type === 'alert' || n.type === 'warning').length} Unread
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {NOTIFS.map(n => {
          const Icon = n.icon;
          return (
            <div key={n.id} style={{
              background: '#0d1020',
              border: '1px solid rgba(255,255,255,0.06)',
              borderLeft: `3px solid ${n.color}`,
              borderRadius: '0 14px 14px 0',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 14,
              transition: 'background 0.15s',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: `${n.color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon size={18} color={n.color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f2ff' }}>{n.title}</div>
                <div style={{ fontSize: 12, color: '#4a5280', marginTop: 4, lineHeight: 1.5 }}>{n.body}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#4a5280', fontSize: 11, flexShrink: 0 }}>
                <Clock size={11} />
                {n.time}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
