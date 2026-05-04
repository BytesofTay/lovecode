function updateProgress() {
  const n = problems.filter(p => done.has(p.id)).length;
  document.getElementById('pFill').style.width = `${(n / problems.length) * 100}%`;
  document.getElementById('pText').textContent = `${n} / ${problems.length}`;
}

// ── Timer ──────────────────────────────────────────────────────────────────
function playAlarm() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.45, 0.9].forEach(t => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = 'sine'; o.frequency.value = 880;
      g.gain.setValueAtTime(0.6, ctx.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.38);
      o.start(ctx.currentTime + t); o.stop(ctx.currentTime + t + 0.4);
    });
  } catch (e) {}
}

function syncTimerDisplay() {
  const el = document.getElementById('tNum');
  if (!el) return;
  el.textContent = fmt(secs);
  el.className = 'timer-num' + (secs <= 60 ? ' danger' : secs <= 300 ? ' warn' : '');
  document.title = running ? `${fmt(secs)} — Blind 75` : 'Blind 75 Practice';
}

function startTimer() {
  if (running) {
    clearInterval(iv); running = false;
    document.getElementById('startBtn').textContent = '▶ Resume';
    return;
  }
  running = true;
  document.getElementById('startBtn').textContent = '⏸ Pause';
  iv = setInterval(() => {
    if (secs <= 0) {
      clearInterval(iv); running = false;
      playAlarm();
      document.getElementById('startBtn').textContent = '▶ Start';
      document.title = "Time's Up! — Blind 75";
      return;
    }
    secs--;
    syncTimerDisplay();
  }, 1000);
}

function resetTimer() {
  clearInterval(iv); running = false; secs = 1200;
  syncTimerDisplay();
  const b = document.getElementById('startBtn');
  if (b) b.textContent = '▶ Start';
  document.title = 'Blind 75 Practice';
}

