// ── Build mode: Parsons + Guided + Templates ───────────────────────────────
// Three sub-modes for active code construction. All persist per-item stats
// via /api/log-quiz with quizType keys: 'parsons' | 'guided' | 'template'.

function renderBuildMode() {
  document.getElementById('appMain').innerHTML = `
    <aside class="sidebar" id="buildSidebar"></aside>
    <section class="panel quiz-wrap" id="buildPanel"></section>`;
  if (buildSubMode === 'parsons' && !parsonsQueue.length) startParsonsSession();
  else if (buildSubMode === 'guided' && !guidedQueue.length) startGuidedSession();
  else if (buildSubMode === 'templates' && !templatesQueue.length) startTemplatesSession();
  else { renderBuildSidebar(); renderBuildContent(); }
}

function setBuildSubMode(m) {
  buildSubMode = m;
  if (m === 'parsons' && !parsonsQueue.length) startParsonsSession();
  else if (m === 'guided' && !guidedQueue.length) startGuidedSession();
  else if (m === 'templates' && !templatesQueue.length) startTemplatesSession();
  else { renderBuildSidebar(); renderBuildContent(); }
}

function renderBuildContent() {
  if (buildSubMode === 'parsons') renderParsonsCard();
  else if (buildSubMode === 'guided') renderGuidedCard();
  else if (buildSubMode === 'templates') renderTemplatesCard();
}

function renderBuildSidebar() {
  const sb = document.getElementById('buildSidebar');
  if (!sb) return;
  const mode = buildSubMode;
  let session, idx, queue, allTime, totalCount, startFn, breakdownLabel, breakdownRows = '';
  if (mode === 'parsons') {
    session = parsonsSession; queue = parsonsQueue; idx = parsonsIdx; allTime = parsonsAllTime;
    totalCount = PARSONS_CHALLENGES.length;
    startFn = 'startParsonsSession()';
    breakdownLabel = 'Per-problem accuracy';
    breakdownRows = PARSONS_CHALLENGES.map(item => {
      const s = allTime[item.id]; if (!s || !s.total) return '';
      const pct = Math.round(s.correct/s.total*100);
      const cls = pct >= 80 ? 'high' : pct >= 50 ? 'mid' : 'low';
      const label = item.problem.length > 26 ? item.problem.slice(0,24)+'…' : item.problem;
      return `<div class="stat-row"><span title="${item.problem}">${label}</span><span class="acc ${cls}">${pct}%</span></div>`;
    }).join('');
  } else if (mode === 'guided') {
    session = guidedSession; queue = guidedQueue; idx = guidedIdx; allTime = guidedAllTime;
    totalCount = GUIDED_BUILDS.length;
    startFn = 'startGuidedSession()';
    breakdownLabel = 'Per-problem accuracy';
    breakdownRows = GUIDED_BUILDS.map(item => {
      const s = allTime[item.id]; if (!s || !s.total) return '';
      const pct = Math.round(s.correct/s.total*100);
      const cls = pct >= 80 ? 'high' : pct >= 50 ? 'mid' : 'low';
      const label = item.problem.length > 26 ? item.problem.slice(0,24)+'…' : item.problem;
      return `<div class="stat-row"><span title="${item.problem}">${label}</span><span class="acc ${cls}">${pct}%</span></div>`;
    }).join('');
  } else { // templates
    session = templatesSession; queue = templatesQueue; idx = templatesIdx; allTime = templatesAllTime;
    totalCount = PATTERN_TEMPLATES.length;
    startFn = 'startTemplatesSession()';
    breakdownLabel = 'Per-pattern accuracy';
    breakdownRows = PATTERN_TEMPLATES.map(item => {
      const s = allTime[item.id]; if (!s || !s.total) return '';
      const pct = Math.round(s.correct/s.total*100);
      const cls = pct >= 80 ? 'high' : pct >= 50 ? 'mid' : 'low';
      return `<div class="stat-row"><span title="${item.pattern}">${item.pattern}</span><span class="acc ${cls}">${pct}%</span></div>`;
    }).join('');
  }
  const total = Object.values(allTime).reduce((s,x)=>s+x.total,0);
  const correct = Object.values(allTime).reduce((s,x)=>s+x.correct,0);
  const overallPct = total ? Math.round(correct/total*100) : 0;
  const sessPct = session.total ? Math.round(session.correct/session.total*100) : 0;
  sb.innerHTML = `
    <div class="submode-toggle three-tab">
      <button class="submode-btn ${mode==='parsons'?'active':''}" onclick="setBuildSubMode('parsons')">🧩 Parsons</button>
      <button class="submode-btn ${mode==='guided'?'active':''}" onclick="setBuildSubMode('guided')">🎯 Guided</button>
      <button class="submode-btn ${mode==='templates'?'active':''}" onclick="setBuildSubMode('templates')">🎨 Templates</button>
    </div>
    <div class="stats-section">
      <h3>This Session</h3>
      <div class="stats-grid">
        <div class="stat-cell"><div class="num">${session.correct}/${session.total}</div><div class="lbl">Score</div></div>
        <div class="stat-cell"><div class="num">${sessPct}%</div><div class="lbl">Accuracy</div></div>
        <div class="stat-cell"><div class="num">${idx}/${queue.length || totalCount}</div><div class="lbl">Progress</div></div>
        <div class="stat-cell"><div class="num">${overallPct}%</div><div class="lbl">All-Time</div></div>
      </div>
    </div>
    <div class="stats-section">
      <button class="btn btn-ghost" style="width:100%;justify-content:center;font-size:12px" onclick="${startFn}">↻ New Session</button>
    </div>
    <div class="stats-list-label" style="padding:8px 12px 4px;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--muted);font-weight:700">${breakdownLabel}</div>
    <div class="stats-list">${breakdownRows || '<div style="padding:14px;font-size:11px;color:var(--muted);text-align:center">Complete items to build history.</div>'}</div>`;
}

// ── Parsons (line ordering) ────────────────────────────────────────────────
function startParsonsSession() {
  parsonsQueue = shuffleCopy(PARSONS_CHALLENGES).slice(0, PARSONS_PER_SESSION);
  parsonsIdx = 0;
  parsonsSession = { correct: 0, total: 0 };
  parsonsCurrentOrder = null;
  parsonsCurrentChecked = false;
  buildSubMode = 'parsons';
  initParsonsCurrent();
  renderBuildSidebar();
  renderBuildContent();
}

function initParsonsCurrent() {
  if (parsonsIdx >= parsonsQueue.length) { parsonsCurrentOrder = null; return; }
  const q = parsonsQueue[parsonsIdx];
  // Shuffle indices [0..n-1] until guaranteed not the trivial identity order
  let order = q.lines.map((_, i) => i);
  for (let attempt = 0; attempt < 20; attempt++) {
    order = shuffleCopy(order);
    if (order.some((v, i) => v !== i)) break;
  }
  parsonsCurrentOrder = order;
  parsonsCurrentChecked = false;
  parsonsCurrentResult = null;
}

function moveParsonsLine(from, to) {
  if (parsonsCurrentChecked) return;
  if (to < 0 || to >= parsonsCurrentOrder.length) return;
  const arr = parsonsCurrentOrder.slice();
  const [moved] = arr.splice(from, 1);
  arr.splice(to, 0, moved);
  parsonsCurrentOrder = arr;
  renderParsonsCard();
}

function checkParsons() {
  if (parsonsCurrentChecked) return;
  const q = parsonsQueue[parsonsIdx];
  const correct = parsonsCurrentOrder.every((v, i) => v === i);
  parsonsCurrentChecked = true;
  parsonsCurrentResult = correct;
  parsonsSession.total++;
  if (correct) parsonsSession.correct++;
  parsonsAllTime[q.id] = parsonsAllTime[q.id] || { correct: 0, total: 0 };
  parsonsAllTime[q.id].total++;
  if (correct) parsonsAllTime[q.id].correct++;
  api('/api/log-quiz', { quizType: 'parsons', questionId: q.id, correct });
  renderParsonsCard();
  renderBuildSidebar();
}

function nextParsons() {
  parsonsIdx++;
  initParsonsCurrent();
  renderParsonsCard();
  renderBuildSidebar();
}

function resetParsonsOrder() {
  if (parsonsCurrentChecked) return;
  initParsonsCurrent();
  renderParsonsCard();
}

function renderParsonsCard() {
  const panel = document.getElementById('buildPanel');
  if (!panel) return;
  if (parsonsIdx >= parsonsQueue.length) { renderParsonsSummary(); return; }
  const q = parsonsQueue[parsonsIdx];
  const escape = (s) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const stats = parsonsAllTime[q.id];
  const allTimeStr = stats && stats.total ? ` · ${Math.round(stats.correct/stats.total*100)}% correct` : '';
  const progressPct = (parsonsIdx / parsonsQueue.length) * 100;
  const levelPill = q.level ? `<span class="level-pill ${q.level}">${q.level}</span>` : '';
  const rows = parsonsCurrentOrder.map((origIdx, displayIdx) => {
    const line = q.lines[origIdx];
    let cls = 'parsons-line';
    let correctHint = '';
    if (parsonsCurrentChecked) {
      if (origIdx === displayIdx) cls += ' correct';
      else {
        cls += ' wrong';
        correctHint = `<div class="parsons-correct-hint">Should be: <code>${escape(q.lines[displayIdx])}</code></div>`;
      }
    }
    const upDisabled = displayIdx === 0 || parsonsCurrentChecked;
    const downDisabled = displayIdx === parsonsCurrentOrder.length - 1 || parsonsCurrentChecked;
    return `<div class="${cls}">
      <div class="parsons-line-num">${displayIdx + 1}</div>
      <pre class="parsons-line-code">${escape(line)}</pre>
      <div class="parsons-line-actions">
        <button class="parsons-arrow" ${upDisabled?'disabled':''} onclick="moveParsonsLine(${displayIdx}, ${displayIdx-1})" title="Move up">▲</button>
        <button class="parsons-arrow" ${downDisabled?'disabled':''} onclick="moveParsonsLine(${displayIdx}, ${displayIdx+1})" title="Move down">▼</button>
      </div>
    </div>${correctHint}`;
  }).join('');
  let feedback = '';
  if (parsonsCurrentChecked) {
    if (parsonsCurrentResult) {
      feedback = `<div class="quiz-feedback right">✓ Correct order!
        <div class="exp">${q.insight || ''}</div>
      </div>`;
    } else {
      const wrongCount = parsonsCurrentOrder.filter((v, i) => v !== i).length;
      feedback = `<div class="quiz-feedback wrong">✗ ${wrongCount} line${wrongCount===1?'':'s'} out of place. The correct order:
        <pre class="optimal-code">${escape(q.lines.join('\n'))}</pre>
        <div class="exp">${q.insight || ''}</div>
      </div>`;
    }
  }
  panel.innerHTML = `
    <div class="quiz-card">
      <div class="quiz-bar">
        <span>Parsons ${parsonsIdx + 1} of ${parsonsQueue.length} · LeetCode: <strong>${q.problem}</strong>${allTimeStr}</span>
        ${levelPill}
      </div>
      <div class="quiz-progressbar"><div style="width:${progressPct}%"></div></div>
      <div class="snippet-problem-heading">
        <div class="snippet-problem-name">${q.problem}</div>
        <div class="snippet-pattern-tag">${q.pattern}</div>
      </div>
      <div class="example-problem" style="margin-bottom:12px">${q.brief}</div>
      <div class="parsons-instruction">Drag-style reorder using ▲ / ▼ until the lines form a working solution, then click <strong>Check</strong>.</div>
      <div class="parsons-list">${rows}</div>
      <div class="quiz-actions" style="margin-top:14px">
        ${parsonsCurrentChecked
          ? `<button class="btn btn-primary" onclick="nextParsons()">${parsonsIdx === parsonsQueue.length - 1 ? 'See Results' : 'Next →'}</button>`
          : `<button class="btn btn-primary" onclick="checkParsons()">Check Order</button>
             <button class="btn btn-ghost" onclick="resetParsonsOrder()">↻ Reshuffle</button>`}
      </div>
      ${feedback}
    </div>`;
}

function renderParsonsSummary() {
  const panel = document.getElementById('buildPanel');
  if (!panel) return;
  const pct = parsonsSession.total ? Math.round(parsonsSession.correct/parsonsSession.total*100) : 0;
  panel.innerHTML = `
    <div class="quiz-card quiz-summary">
      <div style="font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;font-weight:700">Parsons Session Complete</div>
      <div class="big-num">${parsonsSession.correct}/${parsonsSession.total}</div>
      <div class="sub">${pct}% accuracy</div>
      <button class="btn btn-primary" onclick="startParsonsSession()">↻ New Session</button>
    </div>`;
}

// ── Guided builds (forced decisions) ──────────────────────────────────────
function startGuidedSession() {
  guidedQueue = shuffleCopy(GUIDED_BUILDS).slice(0, GUIDED_PER_SESSION);
  guidedIdx = 0;
  guidedSession = { correct: 0, total: 0 };
  guidedDecisionIdx = 0;
  guidedAnswers = [];
  buildSubMode = 'guided';
  renderBuildSidebar();
  renderBuildContent();
}

function renderGuidedCard() {
  const panel = document.getElementById('buildPanel');
  if (!panel) return;
  if (guidedIdx >= guidedQueue.length) { renderGuidedSummary(); return; }
  const q = guidedQueue[guidedIdx];
  const escape = (s) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const stats = guidedAllTime[q.id];
  const allTimeStr = stats && stats.total ? ` · ${Math.round(stats.correct/stats.total*100)}% correct` : '';
  const progressPct = (guidedIdx / guidedQueue.length) * 100;
  const levelPill = q.level ? `<span class="level-pill ${q.level}">${q.level}</span>` : '';
  const totalDecisions = q.decisions.length;
  const allDone = guidedDecisionIdx >= totalDecisions;
  const stepDots = q.decisions.map((_, i) => {
    let cls = 'guided-step';
    if (guidedAnswers[i]) cls += guidedAnswers[i].correct ? ' done-right' : ' done-wrong';
    else if (i === guidedDecisionIdx) cls += ' current';
    return `<div class="${cls}">${i + 1}</div>`;
  }).join('');
  let body = '';
  if (!allDone) {
    const dec = q.decisions[guidedDecisionIdx];
    const answered = guidedAnswers[guidedDecisionIdx];
    const buttons = dec.options.map((opt, i) => {
      let cls = 'btn-mc';
      if (answered) {
        if (i === dec.answerIdx) cls += ' correct';
        else if (i === answered.picked) cls += ' wrong';
      }
      return `<button class="${cls}" ${answered?'disabled':''} onclick="pickGuidedDecision(${i})">${opt}</button>`;
    }).join('');
    let feedback = '';
    if (answered) {
      const right = answered.picked === dec.answerIdx;
      feedback = `<div class="quiz-feedback ${right?'right':'wrong'}">
        ${right ? '✓ Correct.' : `✗ The right call: <b>${dec.options[dec.answerIdx]}</b>`}
        <div class="exp">${dec.explanation}</div>
      </div>
      <div class="quiz-actions">
        <button class="btn btn-primary" onclick="nextGuidedDecision()">${guidedDecisionIdx === totalDecisions - 1 ? 'Reveal final code →' : 'Next decision →'}</button>
      </div>`;
    }
    body = `
      <div class="guided-decision-label">Decision ${guidedDecisionIdx + 1} of ${totalDecisions}</div>
      <div class="vocab-prompt" style="margin-bottom:12px">${dec.q}</div>
      <div class="mc-options">${buttons}</div>
      ${feedback}`;
  } else {
    const correctCount = guidedAnswers.filter(a => a && a.correct).length;
    body = `
      <div class="guided-decision-label">All decisions complete · ${correctCount}/${totalDecisions} right</div>
      <div class="optimal-reveal" style="margin-top:12px">
        <div class="optimal-reveal-label">⚡ Final solution</div>
        <p>You\'ve made every key design decision. Here\'s the assembled code:</p>
        <pre class="optimal-code">${escape(q.finalCode)}</pre>
      </div>
      <div class="quiz-actions" style="margin-top:14px">
        <button class="btn btn-primary" onclick="nextGuidedProblem()">${guidedIdx === guidedQueue.length - 1 ? 'See Results' : 'Next Problem →'}</button>
      </div>`;
  }
  panel.innerHTML = `
    <div class="quiz-card">
      <div class="quiz-bar">
        <span>Guided ${guidedIdx + 1} of ${guidedQueue.length} · LeetCode: <strong>${q.problem}</strong>${allTimeStr}</span>
        ${levelPill}
      </div>
      <div class="quiz-progressbar"><div style="width:${progressPct}%"></div></div>
      <div class="snippet-problem-heading">
        <div class="snippet-problem-name">${q.problem}</div>
        <div class="snippet-pattern-tag">${q.pattern}</div>
      </div>
      <div class="example-problem" style="margin-bottom:14px">${q.brief}</div>
      <div class="guided-stepper">${stepDots}</div>
      ${body}
    </div>`;
}

function pickGuidedDecision(optIdx) {
  if (guidedAnswers[guidedDecisionIdx]) return;
  const q = guidedQueue[guidedIdx];
  const dec = q.decisions[guidedDecisionIdx];
  const correct = optIdx === dec.answerIdx;
  guidedAnswers[guidedDecisionIdx] = { picked: optIdx, correct };
  guidedSession.total++;
  if (correct) guidedSession.correct++;
  // Track per-problem stats: a problem is "correct" only when ALL decisions are correct.
  // Log per-decision so the dashboard sees granular data.
  api('/api/log-quiz', { quizType: 'guided', questionId: `${q.id}__d${guidedDecisionIdx}`, correct });
  renderGuidedCard();
  renderBuildSidebar();
}

function nextGuidedDecision() {
  guidedDecisionIdx++;
  if (guidedDecisionIdx >= guidedQueue[guidedIdx].decisions.length) {
    // Record problem-level stat
    const q = guidedQueue[guidedIdx];
    const allCorrect = guidedAnswers.every(a => a && a.correct);
    guidedAllTime[q.id] = guidedAllTime[q.id] || { correct: 0, total: 0 };
    guidedAllTime[q.id].total++;
    if (allCorrect) guidedAllTime[q.id].correct++;
    api('/api/log-quiz', { quizType: 'guided', questionId: q.id, correct: allCorrect });
  }
  renderGuidedCard();
  renderBuildSidebar();
}

function nextGuidedProblem() {
  guidedIdx++;
  guidedDecisionIdx = 0;
  guidedAnswers = [];
  renderGuidedCard();
  renderBuildSidebar();
}

function renderGuidedSummary() {
  const panel = document.getElementById('buildPanel');
  if (!panel) return;
  const pct = guidedSession.total ? Math.round(guidedSession.correct/guidedSession.total*100) : 0;
  panel.innerHTML = `
    <div class="quiz-card quiz-summary">
      <div style="font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;font-weight:700">Guided Session Complete</div>
      <div class="big-num">${guidedSession.correct}/${guidedSession.total}</div>
      <div class="sub">${pct}% decisions correct</div>
      <button class="btn btn-primary" onclick="startGuidedSession()">↻ New Session</button>
    </div>`;
}

// ── Pattern Templates (multi-blank fill) ──────────────────────────────────
function startTemplatesSession() {
  templatesQueue = shuffleCopy(PATTERN_TEMPLATES).slice(0, TEMPLATES_PER_SESSION);
  templatesIdx = 0;
  templatesSession = { correct: 0, total: 0 };
  templatesBlankIdx = 0;
  templatesAnswers = [];
  buildSubMode = 'templates';
  renderBuildSidebar();
  renderBuildContent();
}

function renderTemplatesCard() {
  const panel = document.getElementById('buildPanel');
  if (!panel) return;
  if (templatesIdx >= templatesQueue.length) { renderTemplatesSummary(); return; }
  const q = templatesQueue[templatesIdx];
  const escape = (s) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const stats = templatesAllTime[q.id];
  const allTimeStr = stats && stats.total ? ` · ${Math.round(stats.correct/stats.total*100)}% correct` : '';
  const progressPct = (templatesIdx / templatesQueue.length) * 100;
  const levelPill = q.level ? `<span class="level-pill ${q.level}">${q.level}</span>` : '';
  const totalBlanks = q.blanks.length;
  const allDone = templatesBlankIdx >= totalBlanks;
  // Pre-escape the template, then inject markers (escape doesn't touch the {{N}} markers since they have no special chars).
  let renderTemplate = escape(q.template);
  for (let i = 1; i <= totalBlanks; i++) {
    const ans = templatesAnswers[i - 1];
    const isCurrent = (i - 1) === templatesBlankIdx && !allDone;
    let replacement;
    if (ans) {
      const userOpt = q.blanks[i - 1].options[ans.picked];
      if (ans.correct) {
        replacement = `<span class="snippet-filled right">${escape(userOpt)}</span>`;
      } else {
        const correctOpt = q.blanks[i - 1].options[q.blanks[i - 1].answerIdx];
        replacement = `<span class="snippet-filled wrong">${escape(userOpt)}</span><span class="snippet-arrow">→</span><span class="snippet-filled right">${escape(correctOpt)}</span>`;
      }
    } else if (isCurrent) {
      replacement = `<span class="snippet-blank current">▢ blank ${i} ▢</span>`;
    } else {
      replacement = `<span class="snippet-blank">▢ blank ${i} ▢</span>`;
    }
    renderTemplate = renderTemplate.replace(`{{${i}}}`, replacement);
  }
  let body;
  if (!allDone) {
    const blank = q.blanks[templatesBlankIdx];
    const answered = templatesAnswers[templatesBlankIdx];
    const buttons = blank.options.map((opt, i) => {
      let cls = 'btn-mc snippet-opt';
      if (answered) {
        if (i === blank.answerIdx) cls += ' correct';
        else if (i === answered.picked) cls += ' wrong';
      }
      return `<button class="${cls}" ${answered?'disabled':''} onclick="pickTemplateBlank(${i})"><code>${escape(opt)}</code></button>`;
    }).join('');
    let feedback = '';
    if (answered) {
      const right = answered.picked === blank.answerIdx;
      feedback = `<div class="quiz-feedback ${right?'right':'wrong'}">
        ${right ? '✓ Correct.' : `✗ Should be: <code>${escape(blank.options[blank.answerIdx])}</code>`}
        <div class="exp">${blank.explanation}</div>
      </div>
      <div class="quiz-actions">
        <button class="btn btn-primary" onclick="nextTemplateBlank()">${templatesBlankIdx === totalBlanks - 1 ? 'See assembled template →' : 'Next blank →'}</button>
      </div>`;
    }
    body = `
      <div class="guided-decision-label">Blank ${templatesBlankIdx + 1} of ${totalBlanks}</div>
      <div class="snippet-prompt" style="margin-top:8px">${blank.q}</div>
      <div class="snippet-options">${buttons}</div>
      ${feedback}`;
  } else {
    const correctCount = templatesAnswers.filter(a => a && a.correct).length;
    body = `
      <div class="guided-decision-label">Template complete · ${correctCount}/${totalBlanks} right</div>
      <div class="optimal-reveal" style="margin-top:12px">
        <div class="optimal-reveal-label">⚡ The assembled pattern</div>
        <p>This is the universal shape of the <strong>${q.pattern}</strong> pattern. Memorize the skeleton — the per-problem code only changes the small parts.</p>
      </div>
      <div class="quiz-actions" style="margin-top:14px">
        <button class="btn btn-primary" onclick="nextTemplateProblem()">${templatesIdx === templatesQueue.length - 1 ? 'See Results' : 'Next Pattern →'}</button>
      </div>`;
  }
  panel.innerHTML = `
    <div class="quiz-card">
      <div class="quiz-bar">
        <span>Template ${templatesIdx + 1} of ${templatesQueue.length} · <strong>${q.pattern}</strong>${allTimeStr}</span>
        ${levelPill}
      </div>
      <div class="quiz-progressbar"><div style="width:${progressPct}%"></div></div>
      <div class="snippet-problem-heading">
        <div class="snippet-problem-name">${q.pattern}</div>
        <div class="snippet-pattern-tag">Pattern Template</div>
      </div>
      <div class="example-problem" style="margin-bottom:14px">${q.description}</div>
      <pre class="snippet-code">${renderTemplate}</pre>
      ${body}
    </div>`;
}

function pickTemplateBlank(optIdx) {
  if (templatesAnswers[templatesBlankIdx]) return;
  const q = templatesQueue[templatesIdx];
  const blank = q.blanks[templatesBlankIdx];
  const correct = optIdx === blank.answerIdx;
  templatesAnswers[templatesBlankIdx] = { picked: optIdx, correct };
  templatesSession.total++;
  if (correct) templatesSession.correct++;
  api('/api/log-quiz', { quizType: 'template', questionId: `${q.id}__b${templatesBlankIdx}`, correct });
  renderTemplatesCard();
  renderBuildSidebar();
}

function nextTemplateBlank() {
  templatesBlankIdx++;
  if (templatesBlankIdx >= templatesQueue[templatesIdx].blanks.length) {
    const q = templatesQueue[templatesIdx];
    const allCorrect = templatesAnswers.every(a => a && a.correct);
    templatesAllTime[q.id] = templatesAllTime[q.id] || { correct: 0, total: 0 };
    templatesAllTime[q.id].total++;
    if (allCorrect) templatesAllTime[q.id].correct++;
    api('/api/log-quiz', { quizType: 'template', questionId: q.id, correct: allCorrect });
  }
  renderTemplatesCard();
  renderBuildSidebar();
}

function nextTemplateProblem() {
  templatesIdx++;
  templatesBlankIdx = 0;
  templatesAnswers = [];
  renderTemplatesCard();
  renderBuildSidebar();
}

function renderTemplatesSummary() {
  const panel = document.getElementById('buildPanel');
  if (!panel) return;
  const pct = templatesSession.total ? Math.round(templatesSession.correct/templatesSession.total*100) : 0;
  panel.innerHTML = `
    <div class="quiz-card quiz-summary">
      <div style="font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;font-weight:700">Templates Session Complete</div>
      <div class="big-num">${templatesSession.correct}/${templatesSession.total}</div>
      <div class="sub">${pct}% accuracy</div>
      <button class="btn btn-primary" onclick="startTemplatesSession()">↻ New Session</button>
    </div>`;
}
