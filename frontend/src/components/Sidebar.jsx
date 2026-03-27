import React from 'react';
import {
  LayoutDashboard, Activity, AlertTriangle, Bot,
  HeartPulse, Settings, Bell, User, Zap
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'vitals',    icon: HeartPulse,     label: 'Vitals' },
  { id: 'signals',   icon: Activity,       label: 'Signals' },
  { id: 'alerts',    icon: AlertTriangle,  label: 'Alerts' },
  { id: 'assistant', icon: Bot,            label: 'AI Assistant' },
];

const BOTTOM_ITEMS = [
  { id: 'notifications', icon: Bell,     label: 'Notifications' },
  { id: 'settings',      icon: Settings, label: 'Settings' },
];

export default function Sidebar({ activeSection, setActiveSection }) {
  return (
    <aside style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logo}>
        <div style={styles.logoIcon}>
          <Zap size={18} color="#07080d" strokeWidth={2.5} />
        </div>
        <div>
          <div style={styles.logoText}>Cure AI</div>
          <div style={styles.logoSub}>Health Monitor</div>
        </div>
      </div>

      {/* Divider */}
      <div style={styles.divider} />

      {/* Nav */}
      <nav style={styles.nav}>
        <div style={styles.navLabel}>MAIN MENU</div>
        {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            style={{
              ...styles.navItem,
              ...(activeSection === id ? styles.navItemActive : {}),
            }}
            onClick={() => setActiveSection(id)}
          >
            <Icon size={17} strokeWidth={activeSection === id ? 2.5 : 1.8} />
            <span>{label}</span>
            {activeSection === id && <div style={styles.activeIndicator} />}
          </button>
        ))}
      </nav>

      <div style={{ flex: 1 }} />

      {/* Bottom items */}
      <div style={styles.bottomNav}>
        {BOTTOM_ITEMS.map(({ id, icon: Icon, label }) => (
          <button key={id} style={styles.navItemBottom} title={label}>
            <Icon size={17} strokeWidth={1.8} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* User profile */}
      <div style={styles.divider} />
      <div style={styles.userCard}>
        <div style={styles.avatar}>
          <User size={14} color="#c8f135" />
        </div>
        <div>
          <p style={styles.userName}>Dr. Alex Chen</p>
          <p style={styles.userRole}>Health Dashboard</p>
        </div>
        <div style={styles.onlineDot} />
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: 220,
    minWidth: 220,
    height: '100vh',
    background: '#0a0c15',
    borderRight: '1px solid rgba(255,255,255,0.05)',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 14px',
    gap: 4,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
    padding: '0 4px',
  },
  logoIcon: {
    width: 36,
    height: 36,
    background: 'linear-gradient(135deg, #c8f135 0%, #8ee832 100%)',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 0 16px rgba(200,241,53,0.35)',
  },
  logoText: {
    fontSize: 15,
    fontWeight: 800,
    color: '#f0f2ff',
    fontFamily: "'Space Grotesk', sans-serif",
    letterSpacing: '-0.02em',
  },
  logoSub: {
    fontSize: 10,
    color: '#4a5280',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    background: 'rgba(255,255,255,0.05)',
    margin: '12px 0',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  navLabel: {
    fontSize: 10,
    color: '#4a5280',
    fontWeight: 600,
    letterSpacing: '0.1em',
    padding: '4px 10px',
    marginBottom: 4,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '9px 12px',
    borderRadius: 10,
    border: 'none',
    background: 'transparent',
    color: '#8892b0',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 500,
    transition: 'all 0.15s ease',
    position: 'relative',
    textAlign: 'left',
    width: '100%',
  },
  navItemActive: {
    background: 'rgba(200,241,53,0.1)',
    color: '#c8f135',
    fontWeight: 600,
  },
  activeIndicator: {
    position: 'absolute',
    right: 10,
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#c8f135',
    boxShadow: '0 0 8px rgba(200,241,53,0.6)',
  },
  bottomNav: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  navItemBottom: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 12px',
    borderRadius: 10,
    border: 'none',
    background: 'transparent',
    color: '#4a5280',
    cursor: 'pointer',
    fontSize: 13,
    transition: 'all 0.15s ease',
    width: '100%',
  },
  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 8px 2px',
    position: 'relative',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: 'rgba(200,241,53,0.1)',
    border: '1.5px solid rgba(200,241,53,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  userName: {
    fontSize: 13,
    fontWeight: 600,
    color: '#f0f2ff',
  },
  userRole: {
    fontSize: 10,
    color: '#4a5280',
  },
  onlineDot: {
    position: 'absolute',
    top: 10,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#4ade80',
    boxShadow: '0 0 6px rgba(74,222,128,0.6)',
  },
};
