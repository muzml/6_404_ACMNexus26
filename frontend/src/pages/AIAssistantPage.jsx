import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, User, Activity, AlertCircle } from 'lucide-react';

// ─── Medical Reasoning Engine ──────────────────────────────────────────────────
const MEDICAL_KB = [
  // Heart rate
  {
    keys: ['heart rate', 'heartrate', 'heart', 'bpm', 'pulse', 'tachycardia', 'bradycardia'],
    respond: (vitals) => {
      const hr = vitals?.heart_rate;
      if (!hr) return heartRateGeneral();
      const v = hr.value;
      const trend = hr.trend;
      if (v > 100)
        return `⚠️ **Elevated Heart Rate Detected — ${v} bpm**\n\nYour resting heart rate is above the normal range (60–100 bpm). This is ${trend === 'up' ? 'and trending upward' : 'currently stable'}.\n\n**Possible Causes:** Stress, dehydration, poor sleep, caffeine overdose, or early fatigue.\n\n**Recommended Precautions:**\n• Drink at least 500ml of water now\n• Take 5 minutes of slow deep breathing (4-7-8 technique)\n• Avoid stimulants (coffee, energy drinks) for the next 6 hours\n• Rest for 20–30 minutes and recheck\n• If above 110 bpm at rest, consult a doctor`;
      if (v < 60)
        return `ℹ️ **Low Heart Rate — ${v} bpm**\n\nYour heart rate is below 60 bpm. This can be normal for athletes but may indicate bradycardia in others.\n\n**Recommended Precautions:**\n• Avoid beta-blockers if not prescribed\n• Eat a light snack if you feel dizzy\n• Move around gently — a short walk can bring rate up\n• If you feel faint or short of breath, seek medical attention`;
      return `✅ **Heart Rate Normal — ${v} bpm**\n\nYour resting heart rate is within the healthy range (60–100 bpm). Keep maintaining:\n• Regular aerobic exercise (150 min/week)\n• Consistent sleep schedule\n• Low caffeine and stress management`;
    },
  },

  // Sleep
  {
    keys: ['sleep', 'tired', 'fatigue', 'rest', 'insomnia', 'drowsy', 'exhausted', 'sleepy'],
    respond: (vitals) => {
      const s = vitals?.sleep_hours;
      const v = s?.value;
      if (v < 6)
        return `🔴 **Sleep Deficit Critical — ${v} hrs last night**\n\nYou are significantly under the recommended 7–9 hours. Chronic sleep deprivation elevates cortisol, weakens immunity, and accelerates cardiovascular risk.\n\n**Immediate Precautions:**\n• Target at least 7.5 hours tonight — plan bedtime now\n• Avoid screens 60 min before sleep (blue light suppresses melatonin)\n• Keep bedroom at 18–20°C (cool = deeper sleep)\n• Avoid alcohol — it destroys REM sleep quality\n• Avoid naps longer than 20 min if it's past 3 PM\n• Magnesium glycinate (200–400 mg) can aid sleep onset`;
      if (v < 7)
        return `⚠️ **Mildly Short Sleep — ${v} hrs**\n\nYou're slightly below the ideal range. Try to recover tonight.\n\n**Precautions:**\n• Aim for 8 hours tonight by setting a fixed alarm and bedtime\n• Cut caffeine intake after 2 PM\n• Do 10 min of mindfulness or light stretching before bed`;
      return `✅ **Sleep Duration Good — ${v} hrs**\n\nGreat job getting enough rest! Consistent quality sleep supports immune function, memory, and cardiovascular health.\n\n**Keep it up:** Maintain a consistent wake-time even on weekends to anchor your circadian rhythm.`;
    },
  },

  // SpO2 / oxygen
  {
    keys: ['spo2', 'oxygen', 'o2', 'saturation', 'breathe', 'breathing', 'respiratory', 'lungs'],
    respond: (vitals) => {
      const s = vitals?.spo2;
      const v = s?.value;
      if (v < 94)
        return `🚨 **Low SpO₂ — ${v}%**\n\nBlood oxygen below 94% is a medical concern. Causes include respiratory illness, high altitude, or pulmonary issues.\n\n**Immediate Actions:**\n• Sit upright or stand — do not lie flat\n• Perform slow deep breaths: inhale 4 sec, hold 2 sec, exhale 6 sec\n• Open a window or move to fresh air\n• If below 90%, call emergency services immediately\n• Do not exercise until SpO₂ stabilises above 95%`;
      if (v < 96)
        return `⚠️ **SpO₂ Slightly Low — ${v}%**\n\nMarginal oxygen saturation. Borderline but worth watching.\n\n**Precautions:**\n• Practise diaphragmatic breathing\n• Ensure good ventilation in your room\n• Avoid smoking or smoke-filled areas\n• Recheck in 30 minutes`;
      return `✅ **SpO₂ Normal — ${v}%**\n\nYour blood oxygen saturation is healthy (95–100%). Your respiratory system is functioning well.`;
    },
  },

  // HRV
  {
    keys: ['hrv', 'heart rate variability', 'variability', 'autonomic', 'recovery', 'nervous system'],
    respond: (vitals) => {
      const h = vitals?.hrv;
      const v = h?.value;
      if (v && v < 40)
        return `🔴 **Low HRV — ${v} ms**\n\nHRV below 40ms signals poor autonomic recovery and elevated stress load on your body.\n\n**Recovery Precautions:**\n• Prioritise 8+ hours of sleep tonight\n• No high-intensity exercise today — walk instead\n• Practice box breathing: 4 sec in, 4 hold, 4 out, 4 hold (x10 rounds)\n• Cold water face splash can stimulate vagal tone\n• Reduce caffeine and alcohol\n• HRV typically improves with 2–3 nights of quality sleep`;
      if (v && v < 55)
        return `⚠️ **HRV Moderate — ${v} ms**\n\nYour HRV is in the lower-normal range. Your body may be under mild stress.\n\n**Suggestions:**\n• Light yoga or stretching\n• Prioritise recovery today — limit strenuous workouts\n• Stay hydrated and avoid alcohol`;
      return `✅ **HRV Healthy — ${v ? v + ' ms' : 'Good Range'}**\n\nGood heart rate variability indicates strong autonomic nervous system function and recovery capacity.`;
    },
  },

  // Activity / steps
  {
    keys: ['steps', 'activity', 'exercise', 'walk', 'sedentary', 'movement', 'workout', 'fitness'],
    respond: (vitals) => {
      const a = vitals?.activity_steps;
      const v = a?.value;
      if (v && v < 4000)
        return `⚠️ **Very Low Activity — ${v.toLocaleString()} steps**\n\nYou are significantly below the recommended 8,000 steps. Sedentary behaviour raises cardiovascular and metabolic risk.\n\n**Precautions & Actions:**\n• Take a 20–30 min brisk walk within the next 2 hours\n• Use stairs instead of elevator\n• Set a timer to stand up every 45 minutes\n• Even 10-min walks 3× a day add up to significant benefit\n• Aim for at least 6,000 steps minimum today`;
      if (v && v < 7000)
        return `ℹ️ **Activity Moderate — ${v.toLocaleString()} steps**\n\nYou're making progress but slightly below the ideal 8,000+ steps goal.\n\n**Suggestions:**\n• Take a 15-min walk after dinner\n• Park further away or get off transport one stop early`;
      return `✅ **Activity Level Good — ${v ? v.toLocaleString() + ' steps' : 'On track'}**\n\nExcellent! Regular physical activity reduces risk of heart disease, diabetes, and improves mental health.`;
    },
  },

  // Body temperature
  {
    keys: ['temperature', 'temp', 'fever', 'hot', 'cold', 'body temp', 'feverish'],
    respond: (vitals) => {
      const t = vitals?.body_temp;
      const v = t?.value;
      if (v && v >= 38)
        return `🔴 **Elevated Temperature — ${v}°C**\n\nFever detected. Normal body temperature is 36.1–37.2°C.\n\n**Precautions:**\n• Drink plenty of fluids — at least 2–3 litres of water/electrolytes today\n• Rest and avoid physical exertion\n• Light clothing and cool environment\n• Paracetamol (as per dosage) can manage fever below 39°C\n• If above 39.5°C or persists >48 hrs, seek medical evaluation\n• Monitor for accompanying symptoms (cough, sore throat, rash)`;
      if (v && v >= 37.3)
        return `⚠️ **Mild Temperature Elevation — ${v}°C**\n\nSlightly above normal. Could be post-exercise, stress, or early-stage infection.\n\n**Monitor It:**\n• Rest for 30 minutes and recheck\n• Stay hydrated\n• Avoid strenuous activity`;
      return `✅ **Body Temperature Normal — ${v ? v + '°C' : 'Normal Range'}**\n\nYour core body temperature is within the healthy range (36.1–37.2°C).`;
    },
  },

  // Screen time
  {
    keys: ['screen', 'screen time', 'phone', 'computer', 'device', 'digital', 'eyes', 'headache'],
    respond: (vitals) => {
      const s = vitals?.screen_time;
      const v = s?.value;
      if (v && v >= 8)
        return `🔴 **Excessive Screen Time — ${v} hrs**\n\nHigh screen time is linked to eye strain, poor sleep, neck pain, and sedentary behaviour.\n\n**Precautions:**\n• Apply the 20-20-20 rule: every 20 min, look 20 feet away for 20 seconds\n• Screen curfew: no screens 1 hour before bed\n• Use night mode / blue light filter after 7 PM\n• Take a 5-min screen break every 45 minutes\n• Reduce to under 6 hrs/day for optimal health`;
      return `ℹ️ **Screen Time — ${v ? v + ' hrs' : 'Moderate'}**\n\nYour screen usage is moderate. Maintain the 20-20-20 rule and blue light filters in the evening.`;
    },
  },

  // Am I safe / overall status
  {
    keys: ['am i safe', 'overall', 'health status', 'how am i', 'my health', 'status', 'general', 'summary', 'safe'],
    respond: (vitals, alerts, riskScore) => {
      const level = riskScore?.level ?? 'Unknown';
      const score = riskScore?.score ?? '—';
      const alertCount = alerts?.length ?? 0;
      const emoji = level === 'High' ? '🔴' : level === 'Medium' ? '🟡' : '🟢';
      return `${emoji} **Overall Health Status — ${level} Risk (Score: ${score}/100)**\n\n${alertCount > 0 ? `**Active Concerns (${alertCount}):**\n${alerts.map(a => `• ${a.icon} ${a.name} — Confidence ${a.confidence}%`).join('\n')}\n\n` : '✅ No active risk alerts.\n\n'}**Key Metrics:**\n• Heart Rate: ${vitals?.heart_rate?.value ?? '—'} bpm (${vitals?.heart_rate?.in_range ? 'Normal' : 'Out of Range'})\n• Sleep: ${vitals?.sleep_hours?.value ?? '—'} hrs (${vitals?.sleep_hours?.in_range ? 'Normal' : 'Low'})\n• SpO₂: ${vitals?.spo2?.value ?? '—'}% (${vitals?.spo2?.in_range ? 'Normal' : 'Low'})\n• HRV: ${vitals?.hrv?.value ?? '—'} ms\n\n**General Advice:**\n${level === 'High' ? '• Reduce physical stress today and prioritise recovery\n• Consult a healthcare provider if symptoms persist\n• Monitor every 2–3 hours' : level === 'Medium' ? '• Moderate caution — rest well and stay hydrated\n• Avoid overexertion today' : '• Keep up your healthy habits!\n• Stay active, hydrated and well-rested'}`;
    },
  },

  // Stress
  {
    keys: ['stress', 'anxiety', 'anxious', 'panic', 'overwhelmed', 'mental', 'worried', 'calm'],
    respond: () =>
      `🧘 **Managing Stress & Anxiety**\n\nStress directly impacts HRV, heart rate, sleep quality, and immune function.\n\n**Immediate Techniques:**\n• **Box Breathing:** Inhale 4 sec → Hold 4 sec → Exhale 4 sec → Hold 4 sec. Repeat 5–10 rounds.\n• **Cold water** on your face activates the dive reflex and slows heart rate instantly\n• **Progressive Muscle Relaxation:** Tense each muscle group for 5 sec, release\n• Walk outside for just 10 minutes — nature reduces cortisol by up to 21%\n\n**Daily Habits:**\n• Limit news/social media consumption\n• Sleep 7–9 hours consistently\n• Exercise 30 min/day (even walking)\n• Connect with someone you trust`,
  },

  // Hydration
  {
    keys: ['water', 'hydration', 'dehydrated', 'thirsty', 'drink', 'fluid'],
    respond: () =>
      `💧 **Hydration Guide**\n\nDehydration of even 1–2% of body weight causes cognitive decline, elevated heart rate, and reduced performance.\n\n**Daily Targets:**\n• Minimum: 2.0 L/day for sedentary adults\n• Active: 2.5–3.5 L/day\n• Hot climate: add 500ml extra\n\n**Signs of Dehydration:**\n• Dark yellow urine\n• Dry mouth or lips\n• Elevated HR at rest\n• Headache or poor concentration\n\n**Quick Fix:**\n• Drink 500ml of water right now\n• Add a pinch of salt + lemon for electrolyte balance\n• Avoid sugary drinks and alcohol — they dehydrate`,
  },

  // Diet / nutrition
  {
    keys: ['diet', 'food', 'eat', 'nutrition', 'meal', 'vitamin', 'supplement', 'weight'],
    respond: () =>
      `🥗 **Nutrition for Optimal Health**\n\n**Anti-Inflammatory Priorities:**\n• Omega-3 sources: salmon, walnuts, flaxseed\n• Colourful vegetables: spinach, broccoli, berries\n• Limit: ultra-processed foods, refined sugar, trans fats\n\n**Micronutrients to Track:**\n• **Magnesium:** supports sleep, HRV, muscle function\n• **Vitamin D:** immune and cardiovascular health\n• **Vitamin B12:** energy and neurological function\n• **Zinc:** immune response and wound healing\n\n**Easy Meal Habit:**\n• Half plate: vegetables\n• Quarter plate: lean protein\n• Quarter plate: complex carbs (oats, brown rice, quinoa)`,
  },

  // Fatigue
  {
    keys: ['fatigue', 'energy', 'low energy', 'lethargic', 'weak', 'burnout', 'drained'],
    respond: (vitals, alerts) => {
      const hasFatigue = alerts?.some(a => a.id === 'early_fatigue');
      return `🔋 **Fatigue Analysis${hasFatigue ? ' — AI Alert Active' : ''}**\n\n${hasFatigue ? '⚠️ Our AI has detected early fatigue markers in your biosignals.\n\n' : ''}**Contributing Factors in Your Data:**\n• Sleep: ${vitals?.sleep_hours?.value ?? '—'} hrs ${(vitals?.sleep_hours?.value ?? 8) < 7 ? '(Below optimal)' : '(OK)'}\n• Steps: ${vitals?.activity_steps?.value?.toLocaleString() ?? '—'} ${(vitals?.activity_steps?.value ?? 8000) < 5000 ? '(Very low)' : '(OK)'}\n• HRV: ${vitals?.hrv?.value ?? '—'} ms ${(vitals?.hrv?.value ?? 50) < 45 ? '(Reduced)' : '(OK)'}\n\n**Recovery Protocol:**\n• Sleep 8–9 hours tonight — non-negotiable\n• Eat a balanced meal with complex carbs and protein\n• Light exercise only — no high-intensity workouts today\n• Practise 10 min of mindfulness or a nap (max 20 min)\n• Stay hydrated — dehydration worsens fatigue by 35%\n• Reduce screen time by 50% today`;
    },
  },
];

function buildResponse(input, vitals, alerts, riskScore) {
  const msg = input.toLowerCase().trim();
  for (const rule of MEDICAL_KB) {
    if (rule.keys.some(k => msg.includes(k))) {
      return rule.respond(vitals, alerts, riskScore);
    }
  }
  // Fallback — still contextual
  return `🤖 **CureAI — Medical Assistant**\n\nI didn't quite catch a specific metric. Here's a quick health snapshot for you:\n\n• Heart Rate: ${vitals?.heart_rate?.value ?? '—'} bpm\n• Sleep: ${vitals?.sleep_hours?.value ?? '—'} hrs\n• SpO₂: ${vitals?.spo2?.value ?? '—'}%\n• HRV: ${vitals?.hrv?.value ?? '—'} ms\n• Steps: ${vitals?.activity_steps?.value?.toLocaleString() ?? '—'}\n\nTry asking me about: **heart rate**, **sleep**, **fatigue**, **SpO₂**, **HRV**, **stress**, **hydration**, **diet**, or **am I safe?**`;
}

// Render markdown-ish bold/newlines
function MsgBody({ text }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <span style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
      {parts.map((p, i) =>
        i % 2 === 1
          ? <strong key={i} style={{ color: 'inherit', fontWeight: 700 }}>{p}</strong>
          : <span key={i}>{p}</span>
      )}
    </span>
  );
}

const QUICK_PROMPTS = [
  'Am I safe?', 'Heart rate status', 'Sleep analysis',
  'Fatigue check', 'My SpO₂', 'Stress tips',
];

export default function AIAssistantPage({ recommendations = [], vitals, alerts, riskScore }) {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([
    {
      role: 'assistant',
      text: `👋 **Hello! I'm CureAI, your personal health assistant.**\n\nI've analysed your latest vitals and I'm ready to help. You can ask me about:\n• Your heart rate, sleep, SpO₂, HRV, activity\n• Stress management and recovery tips\n• Whether your readings are safe\n• Diet, hydration and fatigue advice\n\nTry a quick prompt below or type your question!`,
    },
  ]);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat, typing]);

  const send = (msg) => {
    const text = (msg ?? input).trim();
    if (!text) return;
    setInput('');
    setChat(c => [...c, { role: 'user', text }]);
    setTyping(true);
    setTimeout(() => {
      const reply = buildResponse(text, vitals, alerts, riskScore);
      setChat(c => [...c, { role: 'assistant', text: reply }]);
      setTyping(false);
    }, 600 + Math.random() * 400); // slight random delay feels natural
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, minHeight: 0 }}>
      {/* ── Chat Panel ── */}
      <div style={{
        background: '#0d1020', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 16, display: 'flex', flexDirection: 'column',
        overflow: 'hidden', maxHeight: 'calc(100vh - 140px)',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'linear-gradient(135deg, #c8f135, #8ee832)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Bot size={20} color="#07080d" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f2ff' }}>CureAI Assistant</div>
            <div style={{ fontSize: 11, color: '#4ade80' }}>● Online — Medical Reasoning Engine active</div>
          </div>
          {riskScore && (
            <div style={{
              fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20,
              background: riskScore.level === 'High' ? 'rgba(239,68,68,0.15)' : 'rgba(251,191,36,0.15)',
              color: riskScore.level === 'High' ? '#ef4444' : '#fbbf24',
              border: `1px solid ${riskScore.level === 'High' ? 'rgba(239,68,68,0.3)' : 'rgba(251,191,36,0.3)'}`,
            }}>
              Risk: {riskScore.score}/100
            </div>
          )}
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {chat.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 10, alignItems: 'flex-end' }}>
              {msg.role === 'assistant' && (
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: 'linear-gradient(135deg, #c8f135, #8ee832)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Bot size={14} color="#07080d" />
                </div>
              )}
              <div style={{
                maxWidth: '78%',
                background: msg.role === 'user' ? 'linear-gradient(135deg, #c8f135, #8ee832)' : 'rgba(255,255,255,0.05)',
                color: msg.role === 'user' ? '#07080d' : '#ccd6f6',
                borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                padding: '12px 16px', fontSize: 13,
                fontWeight: msg.role === 'user' ? 600 : 400,
              }}>
                <MsgBody text={msg.text} />
              </div>
              {msg.role === 'user' && (
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: 'rgba(200,241,53,0.15)',
                  border: '1px solid rgba(200,241,53,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <User size={14} color="#c8f135" />
                </div>
              )}
            </div>
          ))}
          {typing && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: 'linear-gradient(135deg, #c8f135, #8ee832)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Bot size={14} color="#07080d" />
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: '12px 16px', display: 'flex', gap: 5 }}>
                {[0,1,2].map(d => (
                  <div key={d} style={{
                    width: 7, height: 7, borderRadius: '50%', background: '#4a5280',
                    animation: 'pulse 1.2s ease-in-out infinite',
                    animationDelay: `${d * 0.2}s`,
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick prompts */}
        <div style={{
          padding: '10px 18px 0', borderTop: '1px solid rgba(255,255,255,0.04)',
          display: 'flex', gap: 8, flexWrap: 'wrap', flexShrink: 0,
        }}>
          {QUICK_PROMPTS.map(p => (
            <button key={p} onClick={() => send(p)} style={{
              padding: '5px 12px', borderRadius: 20, border: '1px solid rgba(200,241,53,0.2)',
              background: 'rgba(200,241,53,0.05)', color: '#c8f135',
              fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
            }}>{p}</button>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: '12px 18px 14px', display: 'flex', gap: 10, flexShrink: 0 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask about heart rate, sleep, HRV, fatigue, stress…"
            style={{
              flex: 1, background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10, padding: '11px 14px',
              color: '#f0f2ff', fontSize: 13, outline: 'none',
            }}
          />
          <button onClick={() => send()} disabled={!input.trim() || typing} style={{
            width: 42, height: 42, borderRadius: 10, border: 'none',
            background: input.trim() && !typing ? 'linear-gradient(135deg, #c8f135, #8ee832)' : 'rgba(200,241,53,0.15)',
            cursor: input.trim() && !typing ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s', flexShrink: 0,
          }}>
            <Send size={16} color={input.trim() ? '#07080d' : '#4a5280'} />
          </button>
        </div>
      </div>

      {/* ── Recommendations Sidebar ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto', maxHeight: 'calc(100vh - 140px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexShrink: 0 }}>
          <Sparkles size={15} color="#c8f135" />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#8892b0', letterSpacing: '0.07em' }}>AI RECOMMENDATIONS</span>
        </div>

        {/* Active Alert confidence chips */}
        {alerts && alerts.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 4 }}>
            <div style={{ fontSize: 11, color: '#4a5280', fontWeight: 600, letterSpacing: '0.06em' }}>ACTIVE ALERTS</div>
            {alerts.map(a => (
              <div key={a.id} style={{
                background: '#0d1020', border: '1px solid rgba(239,68,68,0.2)',
                borderLeft: '3px solid #ef4444',
                borderRadius: '0 10px 10px 0',
                padding: '10px 14px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#f0f2ff' }}>{a.icon} {a.name}</span>
                </div>
                {/* Confidence row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <Activity size={11} color="#ef4444" />
                  <span style={{ fontSize: 11, color: '#ef4444', fontWeight: 700 }}>Confidence: {a.confidence?.toFixed(1)}%</span>
                </div>
                {/* Confidence bar */}
                <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 2,
                    width: `${a.confidence}%`,
                    background: 'linear-gradient(90deg, #ef444480, #ef4444)',
                    transition: 'width 1s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {recommendations.map((rec, i) => (
          <div key={i} style={{
            background: '#0d1020', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 14, padding: '14px 16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 20 }}>{rec.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#f0f2ff' }}>{rec.title}</span>
            </div>
            <p style={{ fontSize: 12, color: '#4a5280', lineHeight: 1.6, margin: 0 }}>{rec.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
