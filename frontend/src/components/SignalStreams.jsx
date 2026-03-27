import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const SIGNAL_META = {
  heart_rate:     { label: 'Heart Rate (bpm)',    color: '#ff4d6d' },
  sleep_hours:    { label: 'Sleep (hrs)',          color: '#9b6dff' },
  activity_steps: { label: 'Activity (steps/100)', color: '#c8f135', scale: 1/100 },
  body_temp:      { label: 'Body Temp (°C)',        color: '#f59e0b' },
  screen_time:    { label: 'Screen Time (hrs)',     color: '#3df5c0' },
  hrv:            { label: 'HRV (ms)',              color: '#ff8c42' },
  spo2:           { label: 'SpO2 (%)',             color: '#60a5fa' },
};

export default function SignalStreams({ timestamps, signals }) {
  if (!timestamps || !signals) return null;

  // Show last 24 points (12 hours)
  const display = 24;
  const ts = timestamps.slice(-display);

  const datasets = Object.entries(SIGNAL_META).map(([key, meta]) => {
    const raw = (signals[key] || []).slice(-display);
    const data = meta.scale ? raw.map(v => +(v * meta.scale).toFixed(2)) : raw;
    return {
      label: meta.label,
      data,
      borderColor: meta.color,
      backgroundColor: `${meta.color}10`,
      borderWidth: 1.8,
      pointRadius: 0,
      pointHoverRadius: 4,
      tension: 0.4,
      fill: false,
    };
  });

  const chartData = { labels: ts, datasets };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    animation: { duration: 600, easing: 'easeInOutQuart' },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#8892b0',
          font: { size: 11, family: 'Inter' },
          boxWidth: 12,
          boxHeight: 2,
          padding: 16,
          usePointStyle: true,
          pointStyle: 'line',
        },
      },
      tooltip: {
        backgroundColor: '#1c1f2e',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        titleColor: '#f0f2ff',
        bodyColor: '#8892b0',
        padding: 12,
        cornerRadius: 10,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
        ticks: {
          color: '#4a5280',
          font: { size: 10, family: 'Inter' },
          maxTicksLimit: 8,
        },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
        ticks: {
          color: '#4a5280',
          font: { size: 10, family: 'Inter' },
        },
      },
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.titleGroup}>
          <span style={styles.sectionBar} />
          <span style={styles.title}>Signal Streams</span>
        </div>
        <div style={styles.badge}>
          <span style={styles.badgeDot} />
          Live 12h
        </div>
      </div>
      <div style={styles.chartWrap}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: '#12141f',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 18,
    padding: '20px 20px 16px',
    animation: 'fadeInUp 0.45s ease both',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  titleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  sectionBar: {
    display: 'block',
    width: 3,
    height: 16,
    background: '#c8f135',
    borderRadius: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: 700,
    color: '#f0f2ff',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 12px',
    borderRadius: 20,
    background: 'rgba(61,245,192,0.08)',
    border: '1px solid rgba(61,245,192,0.15)',
    color: '#3df5c0',
    fontSize: 11,
    fontWeight: 600,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#3df5c0',
    display: 'block',
    animation: 'blink 2s ease-in-out infinite',
  },
  chartWrap: {
    height: 240,
  },
};
