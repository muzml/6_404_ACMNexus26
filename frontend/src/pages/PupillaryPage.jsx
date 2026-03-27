import React, { useEffect, useState, useRef } from 'react';

function averageBrightness(imageData) {
  const data = imageData.data;
  let total = 0;
  let count = 0;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    total += lum;
    count += 1;
  }
  return total / count;
}

function getTimestamp() {
  return performance.now();
}

export default function PupillaryPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState('idle');
  const [latency, setLatency] = useState(null);
  const [message, setMessage] = useState('Click start to run pupillary response test');
  const [whiteFlash, setWhiteFlash] = useState(false);

  const [stream, setStream] = useState(null);

  const clearState = () => {
    setPhase('idle');
    setLatency(null);
    setMessage('Click start to run pupillary response test');
    setWhiteFlash(false);
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, [stream]);

  async function startWebcam() {
    if (videoRef.current && !stream) {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      videoRef.current.srcObject = s;
      setStream(s);
      await videoRef.current.play();
    }
  }

  function captureFrames(durationMs) {
    const frames = [];
    const start = getTimestamp();
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = 320;
    canvas.height = 240;

    return new Promise(resolve => {
      function grab() {
        const now = getTimestamp();
        if (now - start >= durationMs) {
          return resolve(frames);
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const bright = averageBrightness(imageData);

        frames.push({ t: now - start, bright });
        requestAnimationFrame(grab);
      }
      grab();
    });
  }

  function analyzeLatency(baseline, post, thresholdPct = 0.08) {
    const baseAvg = baseline.reduce((acc, f) => acc + f.bright, 0) / baseline.length;
    const target = baseAvg * (1 + thresholdPct);

    const first = post.find(x => x.bright > target);
    if (!first) return null;
    return first.t;
  }

  async function runTest() {
    clearState();
    setPhase('starting');
    setMessage('Acquiring camera access...');

    await startWebcam();

    setMessage('Configuring test...');
    await new Promise(r => setTimeout(r, 500));

    setPhase('baseline');
    setMessage('Baseline capture (2 sec) - relax and look at the camera');
    const baselineFrames = await captureFrames(2000);

    setPhase('flash');
    setMessage('Flash in progress (1 sec)');
    setWhiteFlash(true);
    await new Promise(r => setTimeout(r, 1000));
    setWhiteFlash(false);

    setPhase('post');
    setMessage('Post-flash capture (2 sec)');
    const postFrames = await captureFrames(2000);

    const msLatency = analyzeLatency(baselineFrames, postFrames);
    if (msLatency === null) {
      setMessage('Pupillary constriction not detected clearly.  Please retry with better lighting.');
      setLatency(null);
    } else {
      setLatency(msLatency.toFixed(0));
      let risk = 'Normal';
      if (msLatency > 420) risk = 'High-risk';
      else if (msLatency > 340) risk = 'Medium-risk';
      setMessage(`Latency ${msLatency.toFixed(0)}ms - ${risk}`);
    }

    setPhase('done');
  }

  return (
    <div style={{ padding: '12px 8px' }}>
      <h2>Pupillary Response Test</h2>
      <p style={{ color: '#a4b0cc' }}>
        Measure latency of constriction after bright flash. Slow response can indicate fatigue/stress.
      </p>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 14 }}>
        <button
          onClick={runTest}
          style={{
            background: '#c8f135', border: '1px solid rgba(200,241,53,0.4)', borderRadius: 10,
            color: '#081016', fontWeight: 700, padding: '10px 16px', cursor: 'pointer'
          }}
        >Run Pupillary Test</button>

        <button
          onClick={clearState}
          style={{
            background: '#1f273f', border: '1px solid rgba(120,161,243,0.35)', borderRadius: 10,
            color: '#d8e1ff', padding: '10px 14px', cursor: 'pointer'
          }}
        >Reset</button>
      </div>

      <div style={{ marginBottom: 14 }}>
        <strong>Status:</strong> {message}
      </div>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        <div style={{ width: 340, position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)' }}>
          <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
          {whiteFlash && (
            <div style={{ position: 'absolute', inset: 0, background: '#ffffff', opacity: 1 }} />
          )}
        </div>
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <div style={{ padding: 12, borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(8, 12, 22, 0.85)', minWidth: 220 }}>
          <h3 style={{ margin: '0 0 8px' }}>Pupillary Metrics</h3>
          <p style={{ margin: '4px 0' }}>Phase: <strong>{phase}</strong></p>
          <p style={{ margin: '4px 0' }}>Latency: <strong>{latency ? `${latency} ms` : 'n/a'}</strong></p>
          <p style={{ margin: '4px 0', fontSize: 12 }}>Expected: {'< 340ms'} Normal, 340-420 Medium, {'> 420'} High risk</p>
        </div>
      </div>

      {latency && <div style={{ marginTop: 14, padding: 12, borderRadius: 10, color: '#bce1ff', background: '#11172b' }}>
        <strong>Recommendation:</strong> If your constriction latency is in the Medium/High range, repeat test to verify and consider rest / medical check.
      </div>}
    </div>
  );
}
