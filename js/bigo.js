function startBigoSession() {
  bigoQueue = shuffle([...BIG_O_QUESTIONS]);
  bigoIdx = 0;
  bigoSession = { correct: 0, total: 0 };
  bigoStreak = 0;
  bigoAnswered = false;
  bigoPicked = null;
  renderBigoCard();
  renderBigoStats();
}

function renderBigoMode() {
  document.getElementById('appMain').innerHTML = `
    <aside class="sidebar" id="bigoSidebar"></aside>
    <section class="panel quiz-wrap" id="bigoPanel"></section>`;
  if (!bigoQueue.length) startBigoSession();
  else { renderBigoCard(); renderBigoStats(); }
}

function renderBigoStats() {
  const sb = document.getElementById('bigoSidebar');
  if (!sb) return;
  const totalAttempts = Object.values(bigoAllTime).reduce((s, x) => s + x.total, 0);
  const totalCorrect = Object.values(bigoAllTime).reduce((s, x) => s + x.correct, 0);
  const overallPct = totalAttempts ? Math.round(totalCorrect / totalAttempts * 100) : 0;
  const sessPct = bigoSession.total ? Math.round(bigoSession.correct / bigoSession.total * 100) : 0;
  // Aggregate by complexity class
  const byClass = {};
  COMPLEXITIES.forEach(c => byClass[c] = { correct: 0, total: 0 });
  BIG_O_QUESTIONS.forEach(q => {
    const s = bigoAllTime[q.id];
    if (!s) return;
    byClass[q.answer].correct += s.correct;
    byClass[q.answer].total += s.total;
  });
  const breakdownRows = COMPLEXITIES.map(c => {
    const { correct, total } = byClass[c];
    if (!total) return `<div class="breakdown-row"><span class="complexity">${c}</span><div class="bar-bg"></div><span class="acc-text">—</span></div>`;
    const pct = Math.round(correct / total * 100);
    const cls = pct >= 80 ? 'high' : pct >= 50 ? 'mid' : 'low';
    return `<div class="breakdown-row">
      <span class="complexity">${c}</span>
      <div class="bar-bg"><div class="bar-fill ${cls}" style="width:${pct}%"></div></div>
      <span class="acc-text">${pct}% (${correct}/${total})</span>
    </div>`;
  }).join('');
  sb.innerHTML = `
    <div class="stats-section">
      <h3>This Session</h3>
      <div class="stats-grid">
        <div class="stat-cell"><div class="num">${bigoSession.correct}/${bigoSession.total}</div><div class="lbl">Score</div></div>
        <div class="stat-cell"><div class="num">${sessPct}%</div><div class="lbl">Accuracy</div></div>
        <div class="stat-cell"><div class="num">🔥 ${bigoStreak}</div><div class="lbl">Streak</div></div>
        <div class="stat-cell"><div class="num">${bigoIdx}/${bigoQueue.length || BIG_O_QUESTIONS.length}</div><div class="lbl">Progress</div></div>
      </div>
    </div>
    <div class="stats-section">
      <h3>Weakness · ${totalCorrect}/${totalAttempts} (${overallPct}%)</h3>
      <button class="btn btn-ghost" style="width:100%;justify-content:center;font-size:12px" onclick="startBigoSession()">↻ New Session</button>
    </div>
    <div class="stats-list">${breakdownRows}</div>`;
}

function renderBigoCard() {
  const panel = document.getElementById('bigoPanel');
  if (!panel) return;
  if (bigoIdx >= bigoQueue.length) { renderBigoSummary(); return; }
  const q = bigoQueue[bigoIdx];
  const stats = bigoAllTime[q.id];
  const allTimeStr = stats && stats.total ? ` · seen ${stats.total}× · ${Math.round(stats.correct / stats.total * 100)}% correct` : '';
  const progressPct = (bigoIdx / bigoQueue.length) * 100;
  const buttons = COMPLEXITIES.map(c => {
    let cls = 'btn-complexity';
    if (bigoAnswered) {
      if (c === q.answer) cls += ' correct';
      else if (c === bigoPicked) cls += ' wrong';
    }
    return `<button class="${cls}" ${bigoAnswered ? 'disabled' : ''} onclick="pickBigoAnswer('${c}')">${c}</button>`;
  }).join('');
  let feedback = '';
  if (bigoAnswered) {
    const right = bigoPicked === q.answer;
    feedback = `<div class="quiz-feedback ${right ? 'right' : 'wrong'}">
      ${right ? '✓ Correct!' : `✗ The answer is <b>${q.answer}</b>`}
      <div class="exp">${q.hint}</div>
    </div>
    <div class="quiz-actions">
      <button class="btn btn-primary" onclick="nextBigoQuestion()">${bigoIdx === bigoQueue.length - 1 ? 'See Results' : 'Next →'}</button>
    </div>`;
  }
  panel.innerHTML = `
    <div class="quiz-card">
      <div class="quiz-bar">
        <span>Question ${bigoIdx + 1} of ${bigoQueue.length}${allTimeStr}</span>
        <span class="streak">${bigoStreak > 1 ? '🔥 ' + bigoStreak + ' streak' : ''}</span>
      </div>
      <div class="quiz-progressbar"><div style="width:${progressPct}%"></div></div>
      <div class="quiz-scenario">${q.scenario}</div>
      ${q.code ? `<pre class="quiz-code">${q.code.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</pre>` : ''}
      <div class="complexity-grid">${buttons}</div>
      ${feedback}
    </div>`;
}

function pickBigoAnswer(c) {
  if (bigoAnswered) return;
  bigoAnswered = true;
  bigoPicked = c;
  const q = bigoQueue[bigoIdx];
  const correct = c === q.answer;
  bigoSession.total++;
  if (correct) { bigoSession.correct++; bigoStreak++; } else {
    bigoStreak = 0;
    // spaced repetition: re-queue wrong answer 3 slots ahead
    const reIdx = Math.min(bigoIdx + 3, bigoQueue.length);
    bigoQueue.splice(reIdx, 0, q);
  }
  bigoAllTime[q.id] = bigoAllTime[q.id] || { correct: 0, total: 0 };
  bigoAllTime[q.id].total++;
  if (correct) bigoAllTime[q.id].correct++;
  api('/api/log-quiz', { quizType: 'bigo', questionId: q.id, correct });
  renderBigoCard();
  renderBigoStats();
}

function nextBigoQuestion() {
  bigoIdx++;
  bigoAnswered = false;
  bigoPicked = null;
  renderBigoCard();
  renderBigoStats();
}

function renderBigoSummary() {
  const panel = document.getElementById('bigoPanel');
  if (!panel) return;
  const pct = bigoSession.total ? Math.round(bigoSession.correct / bigoSession.total * 100) : 0;
  panel.innerHTML = `
    <div class="quiz-card quiz-summary">
      <div style="font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;font-weight:700">Session Complete</div>
      <div class="big-num">${bigoSession.correct}/${bigoSession.total}</div>
      <div class="sub">${pct}% accuracy${bigoStreak > 0 ? ` · final streak ${bigoStreak}` : ''}</div>
      <button class="btn btn-primary" onclick="startBigoSession()">↻ New Session</button>
    </div>`;
}

