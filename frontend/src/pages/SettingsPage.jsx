import React, { useState } from 'react';
import { User, Bell, Shield, Monitor, Sliders, ChevronRight, ToggleLeft, ToggleRight } from 'lucide-react';

const SECTIONS = [
  { id: 'profile',  icon: User,     label: 'Profile' },
  { id: 'alerts',   icon: Bell,     label: 'Alert Preferences' },
  { id: 'privacy',  icon: Shield,   label: 'Privacy & Security' },
  { id: 'display',  icon: Monitor,  label: 'Display' },
  { id: 'thresholds', icon: Sliders, label: 'Health Thresholds' },
];

function Toggle({ value, onChange }) {
  return (
    <button onClick={() => onChange(!value)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
      {value
        ? <ToggleRight size={28} color="#c8f135" />
        : <ToggleLeft size={28} color="#4a5280" />}
    </button>
  );
}

function Row({ label, desc, toggle }) {
  const [on, setOn] = useState(toggle ?? true);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}>
      <div>
        <div style={{ fontSize: 13, color: '#ccd6f6', fontWeight: 600 }}>{label}</div>
        {desc && <div style={{ fontSize: 11, color: '#4a5280', marginTop: 2 }}>{desc}</div>}
      </div>
      {toggle !== undefined && <Toggle value={on} onChange={setOn} />}
    </div>
  );
}

function ThresholdRow({ label, defaultVal, unit, color }) {
  const [val, setVal] = useState(defaultVal);
  return (
    <div style={{ padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 13, color: '#ccd6f6', fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 13, color, fontWeight: 700 }}>{val} {unit}</span>
      </div>
      <input
        type="range" min={0} max={200} value={val}
        onChange={e => setVal(+e.target.value)}
        style={{ width: '100%', accentColor: color }}
      />
    </div>
  );
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');

  const renderContent = () => {
    if (activeSection === 'profile') return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(200,241,53,0.1)', border: '2px solid rgba(200,241,53,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <User size={28} color="#c8f135" />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#f0f2ff' }}>Dr. Alex Chen</div>
            <div style={{ fontSize: 12, color: '#4a5280' }}>alex.chen@cureai.health</div>
            <span style={{
              fontSize: 10, color: '#c8f135', fontWeight: 700,
              background: 'rgba(200,241,53,0.1)', border: '1px solid rgba(200,241,53,0.3)',
              padding: '2px 8px', borderRadius: 20, display: 'inline-block', marginTop: 6,
            }}>PRO MEMBER</span>
          </div>
        </div>
        <Row label="Full Name" desc="Dr. Alex Chen" />
        <Row label="Email" desc="alex.chen@cureai.health" />
        <Row label="Time Zone" desc="IST (UTC +5:30)" />
        <Row label="Date of Birth" desc="January 15, 1985" />
      </div>
    );
    if (activeSection === 'alerts') return (
      <div>
        <Row label="High Risk Alerts"    desc="Notify when risk score exceeds 70"         toggle={true} />
        <Row label="HRV Drop Warning"    desc="Alert on significant HRV decrease"          toggle={true} />
        <Row label="Sleep Deficiency"    desc="Alert when sleep drops below 6 hours"       toggle={true} />
        <Row label="Email Notifications" desc="Receive daily summaries via email"          toggle={false} />
        <Row label="Push Notifications"  desc="Real-time alerts on your device"            toggle={true} />
        <Row label="Weekly Report"       desc="Automated weekly health digest"             toggle={true} />
      </div>
    );
    if (activeSection === 'privacy') return (
      <div>
        <Row label="Data Encryption"      desc="All health data encrypted at rest"          toggle={true} />
        <Row label="Analytics Sharing"    desc="Share anonymized data for research"         toggle={false} />
        <Row label="Two-Factor Auth"       desc="Require 2FA on login"                      toggle={true} />
        <Row label="Auto Logout"           desc="Logout after 30 minutes inactivity"        toggle={true} />
        <Row label="Activity Logging"      desc="Log all dashboard access events"           toggle={false} />
      </div>
    );
    if (activeSection === 'display') return (
      <div>
        <Row label="Dark Mode"            desc="Use dark theme across the app"              toggle={true} />
        <Row label="Compact Mode"         desc="Reduce spacing in dashboard cards"          toggle={false} />
        <Row label="Animations"           desc="Enable UI motion and transitions"           toggle={true} />
        <Row label="Live Data Indicator"  desc="Show pulsing live badge in top bar"         toggle={true} />
        <Row label="High Contrast"        desc="Increase contrast for accessibility"        toggle={false} />
      </div>
    );
    if (activeSection === 'thresholds') return (
      <div>
        <ThresholdRow label="Max Resting Heart Rate" defaultVal={100} unit="bpm"   color="#ef4444" />
        <ThresholdRow label="Min Sleep Hours"         defaultVal={7}   unit="hrs"   color="#818cf8" />
        <ThresholdRow label="Min Daily Steps"         defaultVal={8000} unit="steps" color="#facc15" />
        <ThresholdRow label="Min HRV"                 defaultVal={50}  unit="ms"    color="#f472b6" />
        <ThresholdRow label="Max Screen Time"         defaultVal={6}   unit="hrs"   color="#34d399" />
        <ThresholdRow label="Min SpO₂"                defaultVal={95}  unit="%"     color="#38bdf8" />
      </div>
    );
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f0f2ff', margin: 0 }}>Settings</h2>
        <p style={{ fontSize: 13, color: '#4a5280', marginTop: 4 }}>Manage your profile and preferences</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20 }}>
        {/* Settings Nav */}
        <div style={{
          background: '#0d1020', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 16, padding: 12, height: 'fit-content',
        }}>
          {SECTIONS.map(s => {
            const Icon = s.icon;
            const active = activeSection === s.id;
            return (
              <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '11px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: active ? 'rgba(200,241,53,0.1)' : 'transparent',
                color: active ? '#c8f135' : '#8892b0',
                fontSize: 13, fontWeight: active ? 600 : 400,
                transition: 'all 0.15s', marginBottom: 2,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon size={16} />
                  {s.label}
                </div>
                <ChevronRight size={14} style={{ opacity: active ? 1 : 0 }} />
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div style={{
          background: '#0d1020', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 16, padding: '20px 24px',
        }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
