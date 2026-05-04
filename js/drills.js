function startPatternsSession() {
  patternsQueue = shuffleCopy(PATTERN_QUESTIONS).slice(0, PATTERNS_PER_SESSION);
  patternsIdx = 0;
  patternsSession = { correct: 0, total: 0 };
  patternsAnswered = false;
  patternsPicked = null;
  drillsSubMode = 'patterns';
  renderDrillsSidebar();
  renderDrillsContent();
}

function startVocabSession() {
  // Build questions on the fly: pick a subset of terms, generate 3 random distractor terms
  const allTerms = VOCAB_TERMS.map(t => t.term);
  const sample = shuffleCopy(VOCAB_TERMS).slice(0, VOCAB_PER_SESSION);
  const termDefnMap = Object.fromEntries(VOCAB_TERMS.map(t => [t.term, t.defn]));
  const built = sample.map(item => {
    const distractors = shuffleCopy(allTerms.filter(t => t !== item.term)).slice(0, 3);
    const options = shuffleCopy([item.term, ...distractors]);
    return {
      id: 'v_' + item.term.replace(/[^a-z0-9]+/gi, '_'),
      level: item.level,
      term: item.term,
      defn: item.defn,
      options,
      answerIdx: options.indexOf(item.term),
      optionDefns: options.map(o => termDefnMap[o]),
    };
  });
  vocabQueue = built;
  vocabIdx = 0;
  vocabSession = { correct: 0, total: 0 };
  vocabAnswered = false;
  vocabPicked = null;
  drillsSubMode = 'vocab';
  renderDrillsSidebar();
  renderDrillsContent();
}

function renderDrillsMode() {
  document.getElementById('appMain').innerHTML = `
    <aside class="sidebar" id="drillsSidebar"></aside>
    <section class="panel quiz-wrap" id="drillsPanel"></section>`;
  if (drillsSubMode === 'patterns' && !patternsQueue.length) startPatternsSession();
  else if (drillsSubMode === 'vocab' && !vocabQueue.length) startVocabSession();
  else { renderDrillsSidebar(); renderDrillsContent(); }
}

function setDrillsSubMode(m) {
  drillsSubMode = m;
  if (m === 'patterns' && !patternsQueue.length) startPatternsSession();
  else if (m === 'vocab' && !vocabQueue.length) startVocabSession();
  else { renderDrillsSidebar(); renderDrillsContent(); }
}

function renderDrillsContent() {
  if (drillsSubMode === 'patterns') renderPatternsCard();
  else renderVocabCard();
}

function renderDrillsSidebar() {
  const sb = document.getElementById('drillsSidebar');
  if (!sb) return;
  const isPatterns = drillsSubMode === 'patterns';
  const session = isPatterns ? patternsSession : vocabSession;
  const queue = isPatterns ? patternsQueue : vocabQueue;
  const idx = isPatterns ? patternsIdx : vocabIdx;
  const allTime = isPatterns ? patternsAllTime : vocabAllTime;
  const total = Object.values(allTime).reduce((s,x)=>s+x.total,0);
  const correct = Object.values(allTime).reduce((s,x)=>s+x.correct,0);
  const overallPct = total ? Math.round(correct/total*100) : 0;
  const sessPct = session.total ? Math.round(session.correct/session.total*100) : 0;
  // Breakdown by item
  const items = isPatterns ? PATTERN_QUESTIONS : VOCAB_TERMS;
  const breakdownRows = items.map(item => {
    const id = isPatterns ? item.id : ('v_' + item.term.replace(/[^a-z0-9]+/gi,'_'));
    const s = allTime[id];
    if (!s || !s.total) return '';
    const pct = Math.round(s.correct/s.total*100);
    const cls = pct >= 80 ? 'high' : pct >= 50 ? 'mid' : 'low';
    const label = isPatterns
      ? (item.options[item.answerIdx])
      : item.term;
    const truncated = label.length > 26 ? label.slice(0,24)+'…' : label;
    return `<div class="stat-row"><span title="${label.replace(/"/g,'&quot;')}">${truncated}</span><span class="acc ${cls}">${pct}%</span></div>`;
  }).join('');
  const startFn = isPatterns ? 'startPatternsSession()' : 'startVocabSession()';
  sb.innerHTML = `
    <div class="submode-toggle">
      <button class="submode-btn ${isPatterns?'active':''}" onclick="setDrillsSubMode('patterns')">🧠 Patterns</button>
      <button class="submode-btn ${!isPatterns?'active':''}" onclick="setDrillsSubMode('vocab')">📖 Vocab</button>
    </div>
    <div class="stats-section">
      <h3>This Session</h3>
      <div class="stats-grid">
        <div class="stat-cell"><div class="num">${session.correct}/${session.total}</div><div class="lbl">Score</div></div>
        <div class="stat-cell"><div class="num">${sessPct}%</div><div class="lbl">Accuracy</div></div>
        <div class="stat-cell"><div class="num">${idx}/${queue.length || items.length}</div><div class="lbl">Progress</div></div>
        <div class="stat-cell"><div class="num">${overallPct}%</div><div class="lbl">All-Time</div></div>
      </div>
    </div>
    <div class="stats-section">
      <button class="btn btn-ghost" style="width:100%;justify-content:center;font-size:12px" onclick="${startFn}">↻ New Session</button>
    </div>
    <div class="stats-list">${breakdownRows || '<div style="padding:14px;font-size:11px;color:var(--muted);text-align:center">Answer questions to build history.</div>'}</div>`;
}

function renderPatternsCard() {
  const panel = document.getElementById('drillsPanel');
  if (!panel) return;
  if (patternsIdx >= patternsQueue.length) { renderPatternsSummary(); return; }
  const q = patternsQueue[patternsIdx];
  const stats = patternsAllTime[q.id];
  const allTimeStr = stats && stats.total ? ` · seen ${stats.total}× · ${Math.round(stats.correct/stats.total*100)}% correct` : '';
  const progressPct = (patternsIdx / patternsQueue.length) * 100;
  const buttons = q.options.map((opt, i) => {
    let cls = 'btn-pattern';
    if (patternsAnswered) {
      if (i === q.answerIdx) cls += ' correct';
      else if (i === patternsPicked) cls += ' wrong';
    }
    return `<button class="${cls}" ${patternsAnswered?'disabled':''} onclick="pickPatternsAnswer(${i})">${opt}</button>`;
  }).join('');
  let feedback = '';
  if (patternsAnswered) {
    const right = patternsPicked === q.answerIdx;
    const wrongReason = (!right && q.wrongReasons && q.wrongReasons[patternsPicked])
      ? `<div class="wrong-reason">Why <b>${q.options[patternsPicked]}</b> doesn't fit: ${q.wrongReasons[patternsPicked]}</div>`
      : '';
    feedback = `<div class="quiz-feedback ${right?'right':'wrong'}">
      ${right ? '✓ Correct! You spotted the pattern.' : `✗ The best fit is: <b>${q.options[q.answerIdx]}</b>`}
      <div class="exp">${q.explanation}</div>
    </div>
    ${wrongReason}
    <div class="quiz-actions">
      <button class="btn btn-primary" onclick="nextPatternsQuestion()">${patternsIdx === patternsQueue.length - 1 ? 'See Results' : 'Next →'}</button>
    </div>`;
  }
  const levelPill = q.level ? `<span class="level-pill ${q.level}">${q.level}</span>` : '';
  panel.innerHTML = `
    <div class="quiz-card">
      <div class="quiz-bar">
        <span>Pattern ${patternsIdx + 1} of ${patternsQueue.length}${allTimeStr}</span>
        ${levelPill}
      </div>
      <div class="quiz-progressbar"><div style="width:${progressPct}%"></div></div>
      <div class="vocab-prompt">Pick the BEST pattern for this scenario</div>
      <div class="example-problem" style="margin-bottom:18px">${q.scenario}</div>
      <div class="pattern-grid">${buttons}</div>
      ${feedback}
    </div>`;
}

function pickPatternsAnswer(idx) {
  if (patternsAnswered) return;
  patternsAnswered = true;
  patternsPicked = idx;
  const q = patternsQueue[patternsIdx];
  const correct = idx === q.answerIdx;
  patternsSession.total++;
  if (correct) patternsSession.correct++;
  else {
    const reIdx = Math.min(patternsIdx + 3, patternsQueue.length);
    patternsQueue.splice(reIdx, 0, q);
  }
  patternsAllTime[q.id] = patternsAllTime[q.id] || { correct: 0, total: 0 };
  patternsAllTime[q.id].total++;
  if (correct) patternsAllTime[q.id].correct++;
  api('/api/log-quiz', { quizType: 'pattern', questionId: q.id, correct });
  renderPatternsCard();
  renderDrillsSidebar();
}

function nextPatternsQuestion() {
  patternsIdx++;
  patternsAnswered = false;
  patternsPicked = null;
  renderPatternsCard();
  renderDrillsSidebar();
}

function renderPatternsSummary() {
  const panel = document.getElementById('drillsPanel');
  if (!panel) return;
  const pct = patternsSession.total ? Math.round(patternsSession.correct/patternsSession.total*100) : 0;
  panel.innerHTML = `
    <div class="quiz-card quiz-summary">
      <div style="font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;font-weight:700">Pattern Session Complete</div>
      <div class="big-num">${patternsSession.correct}/${patternsSession.total}</div>
      <div class="sub">${pct}% accuracy</div>
      <button class="btn btn-primary" onclick="startPatternsSession()">↻ New Session</button>
    </div>`;
}

function renderVocabCard() {
  const panel = document.getElementById('drillsPanel');
  if (!panel) return;
  if (vocabIdx >= vocabQueue.length) { renderVocabSummary(); return; }
  const q = vocabQueue[vocabIdx];
  const stats = vocabAllTime[q.id];
  const allTimeStr = stats && stats.total ? ` · seen ${stats.total}× · ${Math.round(stats.correct/stats.total*100)}% correct` : '';
  const progressPct = (vocabIdx / vocabQueue.length) * 100;
  const buttons = q.options.map((opt, i) => {
    let cls = 'btn-mc';
    if (vocabAnswered) {
      if (i === q.answerIdx) cls += ' correct';
      else if (i === vocabPicked) cls += ' wrong';
    }
    return `<button class="${cls}" ${vocabAnswered?'disabled':''} onclick="pickVocabAnswer(${i})">${opt}</button>`;
  }).join('');
  let feedback = '';
  if (vocabAnswered) {
    const right = vocabPicked === q.answerIdx;
    const pickedTerm = q.options[vocabPicked];
    const pickedDefn = q.optionDefns ? q.optionDefns[vocabPicked] : '';
    const contrast = (!right && pickedDefn)
      ? `<div class="vocab-contrast"><b>${pickedTerm}</b> actually means: ${pickedDefn}</div>`
      : '';
    feedback = `<div class="quiz-feedback ${right?'right':'wrong'}">
      ${right ? `✓ Correct! That\'s <b>${q.term}</b>.` : `✗ The term is: <b>${q.term}</b>`}
    </div>
    ${contrast}
    <div class="quiz-actions">
      <button class="btn btn-primary" onclick="nextVocabQuestion()">${vocabIdx === vocabQueue.length - 1 ? 'See Results' : 'Next →'}</button>
    </div>`;
  }
  const levelPill = q.level ? `<span class="level-pill ${q.level}">${q.level}</span>` : '';
  panel.innerHTML = `
    <div class="quiz-card">
      <div class="quiz-bar">
        <span>Term ${vocabIdx + 1} of ${vocabQueue.length}${allTimeStr}</span>
        ${levelPill}
      </div>
      <div class="quiz-progressbar"><div style="width:${progressPct}%"></div></div>
      <div class="vocab-prompt">Match this definition to the correct term</div>
      <div class="vocab-defn">${q.defn}</div>
      <div class="mc-options">${buttons}</div>
      ${feedback}
    </div>`;
}

function pickVocabAnswer(idx) {
  if (vocabAnswered) return;
  vocabAnswered = true;
  vocabPicked = idx;
  const q = vocabQueue[vocabIdx];
  const correct = idx === q.answerIdx;
  vocabSession.total++;
  if (correct) vocabSession.correct++;
  else {
    const reIdx = Math.min(vocabIdx + 3, vocabQueue.length);
    vocabQueue.splice(reIdx, 0, q);
  }
  vocabAllTime[q.id] = vocabAllTime[q.id] || { correct: 0, total: 0 };
  vocabAllTime[q.id].total++;
  if (correct) vocabAllTime[q.id].correct++;
  api('/api/log-quiz', { quizType: 'vocab', questionId: q.id, correct });
  renderVocabCard();
  renderDrillsSidebar();
}

function nextVocabQuestion() {
  vocabIdx++;
  vocabAnswered = false;
  vocabPicked = null;
  renderVocabCard();
  renderDrillsSidebar();
}

function renderVocabSummary() {
  const panel = document.getElementById('drillsPanel');
  if (!panel) return;
  const pct = vocabSession.total ? Math.round(vocabSession.correct/vocabSession.total*100) : 0;
  panel.innerHTML = `
    <div class="quiz-card quiz-summary">
      <div style="font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;font-weight:700">Vocab Session Complete</div>
      <div class="big-num">${vocabSession.correct}/${vocabSession.total}</div>
      <div class="sub">${pct}% accuracy</div>
      <button class="btn btn-primary" onclick="startVocabSession()">↻ New Session</button>
    </div>`;
}

