function renderSortingMode() {
  document.getElementById('appMain').innerHTML = `
    <aside class="sidebar" id="sortingSidebar"></aside>
    <section class="panel" id="sortingPanel" style="padding:0;display:block"></section>`;
  if (!traceStates.length) initTrace(selectedAlgoId);
  renderSortingSidebar();
  renderSortingContent();
}

function setSortingSubMode(m) {
  sortingSubMode = m;
  if (m === 'quiz' && !sortingQueue.length) startSortingSession();
  renderSortingSidebar();
  renderSortingContent();
}

function renderSortingSidebar() {
  const sb = document.getElementById('sortingSidebar');
  if (!sb) return;
  if (sortingSubMode === 'reference') {
    const groups = { 'O(n log n)': [], 'O(n²)': [] };
    SORTING_ALGOS.forEach(a => groups[a.group].push(a));
    const renderGroup = (g, items) => `
      <div class="algo-group-label">${g}</div>
      ${items.map(a => `
        <div class="algo-item ${a.id === selectedAlgoId ? 'active' : ''}" onclick="selectAlgo('${a.id}')">
          <span class="a-name">${a.name}</span>
          ${a.mustKnow ? '<span class="a-tag">KEY</span>' : '<span class="a-tag dim">opt</span>'}
        </div>`).join('')}`;
    sb.innerHTML = `
      <div class="submode-toggle">
        <button class="submode-btn active" onclick="setSortingSubMode('reference')">📖 Reference</button>
        <button class="submode-btn" onclick="setSortingSubMode('quiz')">❓ Quiz</button>
      </div>
      ${renderGroup('O(n log n)', groups['O(n log n)'])}
      ${renderGroup('O(n²)', groups['O(n²)'])}`;
  } else {
    const totalAttempts = Object.values(sortingAllTime).reduce((s, x) => s + x.total, 0);
    const totalCorrect = Object.values(sortingAllTime).reduce((s, x) => s + x.correct, 0);
    const overallPct = totalAttempts ? Math.round(totalCorrect / totalAttempts * 100) : 0;
    const sessPct = sortingSession.total ? Math.round(sortingSession.correct / sortingSession.total * 100) : 0;
    const rows = SORTING_QUESTIONS.map(q => {
      const s = sortingAllTime[q.id];
      if (!s || !s.total) return '';
      const pct = Math.round(s.correct / s.total * 100);
      const cls = pct >= 80 ? 'high' : pct >= 50 ? 'mid' : 'low';
      const label = q.question.length > 30 ? q.question.slice(0, 28) + '…' : q.question;
      return `<div class="stat-row"><span title="${q.question.replace(/"/g,'&quot;')}">${label}</span><span class="acc ${cls}">${pct}%</span></div>`;
    }).join('');
    sb.innerHTML = `
      <div class="submode-toggle">
        <button class="submode-btn" onclick="setSortingSubMode('reference')">📖 Reference</button>
        <button class="submode-btn active" onclick="setSortingSubMode('quiz')">❓ Quiz</button>
      </div>
      <div class="stats-section">
        <h3>This Session</h3>
        <div class="stats-grid">
          <div class="stat-cell"><div class="num">${sortingSession.correct}/${sortingSession.total}</div><div class="lbl">Score</div></div>
          <div class="stat-cell"><div class="num">${sessPct}%</div><div class="lbl">Accuracy</div></div>
          <div class="stat-cell"><div class="num">${sortingIdx}/${sortingQueue.length || SORTING_QUESTIONS.length}</div><div class="lbl">Progress</div></div>
          <div class="stat-cell"><div class="num">${overallPct}%</div><div class="lbl">All-Time</div></div>
        </div>
      </div>
      <div class="stats-section">
        <button class="btn btn-ghost" style="width:100%;justify-content:center;font-size:12px" onclick="startSortingSession()">↻ New Session</button>
      </div>
      <div class="stats-list">${rows || '<div style="padding:14px;font-size:11px;color:var(--muted);text-align:center">Answer questions to build history.</div>'}</div>`;
  }
}

function renderSortingContent() {
  if (sortingSubMode === 'reference') renderSortingReference();
  else renderSortingQuiz();
}

function selectAlgo(id) {
  selectedAlgoId = id;
  initTrace(id);
  renderSortingSidebar();
  renderSortingReference();
}

function renderSortingReference() {
  const a = SORTING_ALGOS.find(x => x.id === selectedAlgoId);
  if (!a) return;
  const panel = document.getElementById('sortingPanel');
  if (!panel) return;
  const cls = (s) => s.includes('n²') ? 'slow' : (s === 'O(1)' || s === 'O(n)' ? 'fast' : '');
  panel.innerHTML = `
    <div class="algo-detail">
      <div class="group-badge">${a.group}${a.mustKnow ? ' · MUST KNOW' : ''}</div>
      <h2>${a.name}</h2>
      <p class="summary">${a.summary}</p>
      <div class="algo-stats-grid">
        <div class="algo-stat-box"><div class="lbl">Time (avg)</div><div class="val ${cls(a.timeAvg)}">${a.timeAvg}</div></div>
        <div class="algo-stat-box"><div class="lbl">Time (worst)</div><div class="val ${cls(a.timeWorst)}">${a.timeWorst}</div></div>
        <div class="algo-stat-box"><div class="lbl">Time (best)</div><div class="val ${cls(a.timeBest)}">${a.timeBest}</div></div>
        <div class="algo-stat-box"><div class="lbl">Space</div><div class="val ${cls(a.space)}">${a.space}</div></div>
        <div class="algo-stat-box"><div class="lbl">Stable</div><div class="val ${a.stable ? 'fast' : 'slow'}">${a.stable ? 'Yes' : 'No'}</div></div>
        <div class="algo-stat-box"><div class="lbl">In-place</div><div class="val ${a.space === 'O(1)' ? 'fast' : ''}">${a.space === 'O(1)' ? 'Yes' : 'No'}</div></div>
      </div>
      <div class="algo-section"><h3>Key Idea</h3><p>${a.keyIdea}</p></div>
      <div class="algo-section"><h3>When to Use</h3><p>${a.whenToUse}</p></div>
      <div class="algo-section"><h3>Pseudocode</h3><pre class="pseudocode">${a.pseudocode.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</pre></div>
      <div class="trace-section" id="traceSection">${traceHtml()}</div>
    </div>`;
}

function startSortingSession() {
  sortingQueue = shuffle([...SORTING_QUESTIONS]);
  sortingIdx = 0;
  sortingSession = { correct: 0, total: 0 };
  sortingAnswered = false;
  sortingPicked = null;
  if (sortingSubMode !== 'quiz') sortingSubMode = 'quiz';
  renderSortingSidebar();
  renderSortingQuiz();
}

function renderSortingQuiz() {
  const panel = document.getElementById('sortingPanel');
  if (!panel) return;
  if (!sortingQueue.length) { startSortingSession(); return; }
  if (sortingIdx >= sortingQueue.length) { renderSortingSummary(); return; }
  const q = sortingQueue[sortingIdx];
  const stats = sortingAllTime[q.id];
  const allTimeStr = stats && stats.total ? ` · seen ${stats.total}× · ${Math.round(stats.correct / stats.total * 100)}% correct` : '';
  const progressPct = (sortingIdx / sortingQueue.length) * 100;
  const buttons = q.options.map((opt, i) => {
    let cls = 'btn-mc';
    if (sortingAnswered) {
      if (i === q.answer) cls += ' correct';
      else if (i === sortingPicked) cls += ' wrong';
    }
    return `<button class="${cls}" ${sortingAnswered ? 'disabled' : ''} onclick="pickSortingAnswer(${i})">${opt}</button>`;
  }).join('');
  let feedback = '';
  if (sortingAnswered) {
    const right = sortingPicked === q.answer;
    feedback = `<div class="quiz-feedback ${right ? 'right' : 'wrong'}">
      ${right ? '✓ Correct!' : `✗ The answer is: <b>${q.options[q.answer]}</b>`}
      <div class="exp">${q.explanation}</div>
    </div>
    <div class="quiz-actions">
      <button class="btn btn-primary" onclick="nextSortingQuestion()">${sortingIdx === sortingQueue.length - 1 ? 'See Results' : 'Next →'}</button>
    </div>`;
  }
  panel.innerHTML = `
    <div class="quiz-wrap">
      <div class="quiz-card">
        <div class="quiz-bar">
          <span>Question ${sortingIdx + 1} of ${sortingQueue.length}${allTimeStr}</span>
        </div>
        <div class="quiz-progressbar"><div style="width:${progressPct}%"></div></div>
        <div class="quiz-question">${q.question}</div>
        <div class="mc-options">${buttons}</div>
        ${feedback}
      </div>
    </div>`;
}

function pickSortingAnswer(idx) {
  if (sortingAnswered) return;
  sortingAnswered = true;
  sortingPicked = idx;
  const q = sortingQueue[sortingIdx];
  const correct = idx === q.answer;
  sortingSession.total++;
  if (correct) sortingSession.correct++;
  else {
    const reIdx = Math.min(sortingIdx + 3, sortingQueue.length);
    sortingQueue.splice(reIdx, 0, q);
  }
  sortingAllTime[q.id] = sortingAllTime[q.id] || { correct: 0, total: 0 };
  sortingAllTime[q.id].total++;
  if (correct) sortingAllTime[q.id].correct++;
  api('/api/log-quiz', { quizType: 'sorting', questionId: q.id, correct });
  renderSortingQuiz();
  renderSortingSidebar();
}

function nextSortingQuestion() {
  sortingIdx++;
  sortingAnswered = false;
  sortingPicked = null;
  renderSortingQuiz();
  renderSortingSidebar();
}

function renderSortingSummary() {
  const panel = document.getElementById('sortingPanel');
  if (!panel) return;
  const pct = sortingSession.total ? Math.round(sortingSession.correct / sortingSession.total * 100) : 0;
  panel.innerHTML = `
    <div class="quiz-wrap">
      <div class="quiz-card quiz-summary">
        <div style="font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;font-weight:700">Session Complete</div>
        <div class="big-num">${sortingSession.correct}/${sortingSession.total}</div>
        <div class="sub">${pct}% accuracy</div>
        <button class="btn btn-primary" onclick="startSortingSession()">↻ New Session</button>
      </div>
    </div>`;
}

