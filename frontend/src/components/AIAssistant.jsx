import React, { useEffect, useRef, useState } from 'react';
import { Bot, Sparkles } from 'lucide-react';

export default function AIAssistant({ recommendations }) {
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    setVisible([]);
    if (!recommendations?.length) return;
    recommendations.forEach((_, i) => {
      setTimeout(() => {
        setVisible(prev => [...prev, i]);
      }, i * 180);
    });
  }, [recommendations]);

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.sectionBar} />
        <span style={styles.title}>AI Health Assistant</span>
        <div style={styles.aiTag}>
          <Sparkles size={10} color="#c8f135" />
          <span>CureAI</span>
        </div>
      </div>

      {/* Bot persona */}
      <div style={styles.persona}>
        <div style={styles.botIcon}>
          <Bot size={18} color="#07080d" strokeWidth={2.5} />
        </div>
        <div style={styles.bubble}>
          <p style={styles.bubbleText}>
            Based on your current signals, here are my recommendations to reduce your health risk:
          </p>
        </div>
      </div>

      {/* Recommendations */}
      <div style={styles.recList}>
        {(recommendations || []).map((rec, i) => (
          <div
            key={i}
            style={{
              ...styles.recCard,
              opacity: visible.includes(i) ? 1 : 0,
              transform: visible.includes(i) ? 'translateY(0)' : 'translateY(8px)',
              transition: `opacity 0.3s ease, transform 0.3s ease`,
            }}
          >
            <div style={styles.recIcon}>{rec.icon}</div>
            <div style={styles.recContent}>
              <p style={styles.recTitle}>{rec.title}</p>
              <p style={styles.recDetail}>{rec.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <div style={styles.footerDot} />
        <span style={styles.footerText}>
          Updated based on your latest health signals
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
    background: '#9b6dff',
    borderRadius: 2,
    flexShrink: 0,
  },
  title: {
    fontSize: 15,
    fontWeight: 700,
    color: '#f0f2ff',
    flex: 1,
  },
  aiTag: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    padding: '3px 10px',
    borderRadius: 20,
    background: 'rgba(200,241,53,0.08)',
    border: '1px solid rgba(200,241,53,0.15)',
    color: '#c8f135',
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.06em',
  },
  persona: {
    display: 'flex',
    gap: 12,
    alignItems: 'flex-start',
  },
  botIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    background: 'linear-gradient(135deg, #9b6dff 0%, #6b3fff 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 0 16px rgba(155,109,255,0.3)',
  },
  bubble: {
    background: 'rgba(155,109,255,0.08)',
    border: '1px solid rgba(155,109,255,0.15)',
    borderRadius: '4px 12px 12px 12px',
    padding: '10px 13px',
    flex: 1,
  },
  bubbleText: {
    fontSize: 12,
    color: '#8892b0',
    lineHeight: 1.5,
  },
  recList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    overflowY: 'auto',
    maxHeight: 260,
  },
  recCard: {
    display: 'flex',
    gap: 12,
    alignItems: 'flex-start',
    padding: '10px 12px',
    borderRadius: 10,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    transition: 'opacity 0.3s ease, transform 0.3s ease',
  },
  recIcon: {
    fontSize: 20,
    flexShrink: 0,
    lineHeight: 1,
    marginTop: 1,
  },
  recContent: {
    flex: 1,
  },
  recTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: '#f0f2ff',
    marginBottom: 3,
  },
  recDetail: {
    fontSize: 11,
    color: '#8892b0',
    lineHeight: 1.5,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    paddingTop: 4,
    borderTop: '1px solid rgba(255,255,255,0.05)',
  },
  footerDot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: '#9b6dff',
    animation: 'blink 2s ease-in-out infinite',
  },
  footerText: {
    fontSize: 11,
    color: '#4a5280',
  },
};
