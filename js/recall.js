// ── Recall mode: Flashcards + Inverse + Why-questions ─────────────────────
// All three are self-graded active-recall drills. Flashcards use SM-2 lite
// scheduling (Again / Hard / Good / Easy) persisted to localStorage so cards
// re-surface based on prior performance.

const RECALL_SCHED_KEY = 'lovecode_recall_sched';
let recallSchedule = {};
try { recallSchedule = JSON.parse(localStorage.getItem(RECALL_SCHED_KEY) || '{}'); } catch (_) {}

function saveRecallSchedule() {
  try { localStorage.setItem(RECALL_SCHED_KEY, JSON.stringify(recallSchedule)); } catch (_) {}
}

function scheduleNext(cardId, rating) {
  const s = recallSchedule[cardId] || { interval: 0, ease: 2.5 };
  if (rating === 'again') {
    s.interval = 0;
    s.ease = Math.max(1.3, s.ease - 0.2);
  } else if (rating === 'hard') {
    s.interval = Math.max(1, (s.interval || 1) * 1.2);
    s.ease = Math.max(1.3, s.ease - 0.15);
  } else if (rating === 'good') {
    s.interval = s.interval === 0 ? 1 : s.interval * s.ease;
  } else if (rating === 'easy') {
    s.interval = s.interval === 0 ? 3 : s.interval * s.ease * 1.3;
    s.ease += 0.15;
  }
  s.dueAt = Date.now() + s.interval * 24 * 60 * 60 * 1000;
  s.lastSeen = Date.now();
  recallSchedule[cardId] = s;
  saveRecallSchedule();
}

function isDue(cardId) {
  const s = recallSchedule[cardId];
  if (!s) return true; // never seen
  return (s.dueAt || 0) <= Date.now();
}

function buildRecallQueue(allCards, max) {
  const due = [], fresh = [], later = [];
  allCards.forEach(c => {
    const s = recallSchedule[c.id];
    if (!s) fresh.push(c);
    else if ((s.dueAt || 0) <= Date.now()) due.push(c);
    else later.push(c);
  });
  // Priority: due first, then fresh, then later
  return shuffleCopy(due).concat(shuffleCopy(fresh)).concat(shuffleCopy(later)).slice(0, max);
}

// ── Mode dispatch ────────────────────────────────────────────────────────
function renderRecallMode() {
  document.getElementById('appMain').innerHTML = `
    <aside class="sidebar" id="recallSidebar"></aside>
    <section class="panel quiz-wrap" id="recallPanel"></section>`;
  if (recallSubMode === 'flashcards' && !flashcardsQueue.length) startFlashcardsSession();
  else if (recallSubMode === 'inverse' && !inverseQueue.length) startInverseSession();
  else if (recallSubMode === 'why' && !whyQueue.length) startWhySession();
  else { renderRecallSidebar(); renderRecallContent(); }
}

function setRecallSubMode(m) {
  recallSubMode = m;
  if (m === 'flashcards' && !flashcardsQueue.length) startFlashcardsSession();
  else if (m === 'inverse' && !inverseQueue.length) startInverseSession();
  else if (m === 'why' && !whyQueue.length) startWhySession();
  else { renderRecallSidebar(); renderRecallContent(); }
}

function renderRecallContent() {
  if (recallSubMode === 'flashcards') renderFlashcardsCard();
  else if (recallSubMode === 'inverse') renderInverseCard();
  else if (recallSubMode === 'why') renderWhyCard();
}

function renderRecallSidebar() {
  const sb = document.getElementById('recallSidebar');
  if (!sb) return;
  const mode = recallSubMode;
  let session, queue, idx, allTime, totalCount, startFn, breakdownLabel, breakdownRows;
  if (mode === 'flashcards') {
    session = flashcardsSession; queue = flashcardsQueue; idx = flashcardsIdx; allTime = flashcardsAllTime;
    totalCount = FLASHCARDS.length; startFn = 'startFlashcardsSession()';
    breakdownLabel = 'Spaced repetition status';
    const due = FLASHCARDS.filter(c => isDue(c.id) && recallSchedule[c.id]).length;
    const fresh = FLASHCARDS.filter(c => !recallSchedule[c.id]).length;
    const learning = FLASHCARDS.length - due - fresh;
    breakdownRows = `
      <div class="stat-row"><span>Due now</span><span class="acc ${due > 0 ? 'mid' : 'high'}">${due}</span></div>
      <div class="stat-row"><span>New (never seen)</span><span class="acc">${fresh}</span></div>
      <div class="stat-row"><span>Scheduled (future)</span><span class="acc high">${learning}</span></div>`;
  } else if (mode === 'inverse') {
    session = inverseSession; queue = inverseQueue; idx = inverseIdx; allTime = inverseAllTime;
    totalCount = INVERSE_CARDS.length; startFn = 'startInverseSession()';
    breakdownLabel = 'Per-card accuracy';
    breakdownRows = INVERSE_CARDS.map(c => {
      const s = allTime[c.id]; if (!s || !s.total) return '';
      const pct = Math.round(s.correct/s.total*100);
      const cls = pct >= 80 ? 'high' : pct >= 50 ? 'mid' : 'low';
      const label = c.options[c.answerIdx];
      const truncated = label.length > 26 ? label.slice(0,24)+'…' : label;
      return `<div class="stat-row"><span title="${label}">${truncated}</span><span class="acc ${cls}">${pct}%</span></div>`;
    }).join('');
  } else { // why
    session = whySession; queue = whyQueue; idx = whyIdx; allTime = whyAllTime;
    totalCount = WHY_QUESTIONS.length; startFn = 'startWhySession()';
    breakdownLabel = 'Self-graded recall by category';
    const byCat = {};
    WHY_QUESTIONS.forEach(c => {
      const s = allTime[c.id]; if (!s || !s.total) return;
      byCat[c.category] = byCat[c.category] || { correct: 0, total: 0 };
      byCat[c.category].correct += s.correct;
      byCat[c.category].total += s.total;
    });
    breakdownRows = Object.keys(byCat).sort().map(cat => {
      const s = byCat[cat];
      const pct = Math.round(s.correct/s.total*100);
      const cls = pct >= 80 ? 'high' : pct >= 50 ? 'mid' : 'low';
      return `<div class="stat-row"><span>${cat}</span><span class="acc ${cls}">${pct}%</span></div>`;
    }).join('');
  }
  const total = Object.values(allTime).reduce((s,x)=>s+x.total,0);
  const correct = Object.values(allTime).reduce((s,x)=>s+x.correct,0);
  const overallPct = total ? Math.round(correct/total*100) : 0;
  const sessPct = session.total ? Math.round(session.correct/session.total*100) : 0;
  sb.innerHTML = `
    <div class="submode-toggle three-tab">
      <button class="submode-btn ${mode==='flashcards'?'active':''}" onclick="setRecallSubMode('flashcards')">📇 Flashcards</button>
      <button class="submode-btn ${mode==='inverse'?'active':''}" onclick="setRecallSubMode('inverse')">🔄 Inverse</button>
      <button class="submode-btn ${mode==='why'?'active':''}" onclick="setRecallSubMode('why')">💭 Why</button>
    </div>
    <div class="stats-section">
      <h3>This Session</h3>
      <div class="stats-grid">
        <div class="stat-cell"><div class="num">${session.correct}/${session.total}</div><div class="lbl">Recalled</div></div>
        <div class="stat-cell"><div class="num">${sessPct}%</div><div class="lbl">Accuracy</div></div>
        <div class="stat-cell"><div class="num">${idx}/${queue.length || totalCount}</div><div class="lbl">Progress</div></div>
        <div class="stat-cell"><div class="num">${overallPct}%</div><div class="lbl">All-Time</div></div>
      </div>
    </div>
    <div class="stats-section">
      <button class="btn btn-ghost" style="width:100%;justify-content:center;font-size:12px" onclick="${startFn}">↻ New Session</button>
    </div>
    <div class="stats-list-label" style="padding:8px 12px 4px;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--muted);font-weight:700">${breakdownLabel}</div>
    <div class="stats-list">${breakdownRows || '<div style="padding:14px;font-size:11px;color:var(--muted);text-align:center">Complete cards to build history.</div>'}</div>`;
}

// ── Flashcards (true self-graded with SM-2 lite) ─────────────────────────
function startFlashcardsSession() {
  flashcardsQueue = buildRecallQueue(FLASHCARDS, FLASHCARDS_PER_SESSION);
  flashcardsIdx = 0;
  flashcardsSession = { correct: 0, total: 0 };
  flashcardsRevealed = false;
  recallSubMode = 'flashcards';
  renderRecallSidebar();
  renderRecallContent();
}

function renderFlashcardsCard() {
  const panel = document.getElementById('recallPanel');
  if (!panel) return;
  if (flashcardsIdx >= flashcardsQueue.length) { renderFlashcardsSummary(); return; }
  const c = flashcardsQueue[flashcardsIdx];
  const s = recallSchedule[c.id];
  const seenStr = s ? `Seen ${s.lastSeen ? Math.round((Date.now() - s.lastSeen) / 86400000) : 0}d ago · interval ${(s.interval || 0).toFixed(1)}d · ease ${s.ease.toFixed(2)}` : 'New card — first time seeing this';
  const progressPct = (flashcardsIdx / flashcardsQueue.length) * 100;
  const levelPill = c.level ? `<span class="level-pill ${c.level}">${c.level}</span>` : '';
  const stats = flashcardsAllTime[c.id];
  const accStr = stats && stats.total ? ` · ${Math.round(stats.correct/stats.total*100)}% recalled` : '';
  let body;
  if (!flashcardsRevealed) {
    body = `
      <div class="flashcard-prompt-label">Think of the answer, then reveal</div>
      <div class="flashcard-front">${c.front}</div>
      <div class="quiz-actions" style="margin-top:18px">
        <button class="btn btn-primary" onclick="revealFlashcard()">🔍 Reveal Answer</button>
      </div>`;
  } else {
    body = `
      <div class="flashcard-prompt-label">Front</div>
      <div class="flashcard-front faded">${c.front}</div>
      <div class="flashcard-back-label">Answer</div>
      <div class="flashcard-back">${c.back}</div>
      ${c.detail ? `<div class="flashcard-detail">${c.detail}</div>` : ''}
      <div class="flashcard-rating-label">How well did you recall?</div>
      <div class="flashcard-rating">
        <button class="rating-btn again" onclick="rateFlashcard('again')">
          <div class="rt-label">Again</div>
          <div class="rt-sub">re-queue now</div>
        </button>
        <button class="rating-btn hard" onclick="rateFlashcard('hard')">
          <div class="rt-label">Hard</div>
          <div class="rt-sub">~1 day</div>
        </button>
        <button class="rating-btn good" onclick="rateFlashcard('good')">
          <div class="rt-label">Good</div>
          <div class="rt-sub">~3 days</div>
        </button>
        <button class="rating-btn easy" onclick="rateFlashcard('easy')">
          <div class="rt-label">Easy</div>
          <div class="rt-sub">~7+ days</div>
        </button>
      </div>`;
  }
  panel.innerHTML = `
    <div class="quiz-card">
      <div class="quiz-bar">
        <span>Card ${flashcardsIdx + 1} of ${flashcardsQueue.length} · ${c.category}${accStr}</span>
        ${levelPill}
      </div>
      <div class="quiz-progressbar"><div style="width:${progressPct}%"></div></div>
      <div class="flashcard-meta">${seenStr}</div>
      ${body}
    </div>`;
}

function revealFlashcard() {
  flashcardsRevealed = true;
  renderFlashcardsCard();
}

function rateFlashcard(rating) {
  const c = flashcardsQueue[flashcardsIdx];
  const correct = rating === 'good' || rating === 'easy';
  scheduleNext(c.id, rating);
  flashcardsSession.total++;
  if (correct) flashcardsSession.correct++;
  flashcardsAllTime[c.id] = flashcardsAllTime[c.id] || { correct: 0, total: 0 };
  flashcardsAllTime[c.id].total++;
  if (correct) flashcardsAllTime[c.id].correct++;
  api('/api/log-quiz', { quizType: 'flashcard', questionId: c.id, correct });
  // If "Again", re-queue 3-4 slots ahead
  if (rating === 'again') {
    const reIdx = Math.min(flashcardsIdx + 3, flashcardsQueue.length);
    flashcardsQueue.splice(reIdx, 0, c);
  }
  flashcardsIdx++;
  flashcardsRevealed = false;
  renderFlashcardsCard();
  renderRecallSidebar();
}

function renderFlashcardsSummary() {
  const panel = document.getElementById('recallPanel');
  if (!panel) return;
  const pct = flashcardsSession.total ? Math.round(flashcardsSession.correct/flashcardsSession.total*100) : 0;
  panel.innerHTML = `
    <div class="quiz-card quiz-summary">
      <div style="font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;font-weight:700">Flashcard Session Complete</div>
      <div class="big-num">${flashcardsSession.correct}/${flashcardsSession.total}</div>
      <div class="sub">${pct}% recalled · cards rescheduled based on ratings</div>
      <button class="btn btn-primary" onclick="startFlashcardsSession()">↻ New Session</button>
    </div>`;
}

// ── Inverse cards (code → identify) ──────────────────────────────────────
function startInverseSession() {
  inverseQueue = shuffleCopy(INVERSE_CARDS).slice(0, INVERSE_PER_SESSION);
  inverseIdx = 0;
  inverseSession = { correct: 0, total: 0 };
  inverseAnswered = false;
  inversePicked = null;
  recallSubMode = 'inverse';
  renderRecallSidebar();
  renderRecallContent();
}

function renderInverseCard() {
  const panel = document.getElementById('recallPanel');
  if (!panel) return;
  if (inverseIdx >= inverseQueue.length) { renderInverseSummary(); return; }
  const q = inverseQueue[inverseIdx];
  const escape = (s) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const stats = inverseAllTime[q.id];
  const allTimeStr = stats && stats.total ? ` · ${Math.round(stats.correct/stats.total*100)}% correct` : '';
  const progressPct = (inverseIdx / inverseQueue.length) * 100;
  const buttons = q.options.map((opt, i) => {
    let cls = 'btn-mc';
    if (inverseAnswered) {
      if (i === q.answerIdx) cls += ' correct';
      else if (i === inversePicked) cls += ' wrong';
    }
    return `<button class="${cls}" ${inverseAnswered?'disabled':''} onclick="pickInverseAnswer(${i})">${opt}</button>`;
  }).join('');
  let feedback = '';
  if (inverseAnswered) {
    const right = inversePicked === q.answerIdx;
    feedback = `<div class="quiz-feedback ${right?'right':'wrong'}">
      ${right ? '✓ Correct.' : `✗ This is: <b>${q.options[q.answerIdx]}</b>`}
      <div class="exp">${q.explanation}</div>
    </div>
    <div class="quiz-actions">
      <button class="btn btn-primary" onclick="nextInverseQuestion()">${inverseIdx === inverseQueue.length - 1 ? 'See Results' : 'Next →'}</button>
    </div>`;
  }
  panel.innerHTML = `
    <div class="quiz-card">
      <div class="quiz-bar">
        <span>Card ${inverseIdx + 1} of ${inverseQueue.length}${allTimeStr}</span>
      </div>
      <div class="quiz-progressbar"><div style="width:${progressPct}%"></div></div>
      <div class="vocab-prompt">Read the code. What problem and pattern is this?</div>
      <pre class="snippet-code">${escape(q.code)}</pre>
      <div class="mc-options" style="margin-top:14px">${buttons}</div>
      ${feedback}
    </div>`;
}

function pickInverseAnswer(idx) {
  if (inverseAnswered) return;
  inverseAnswered = true;
  inversePicked = idx;
  const q = inverseQueue[inverseIdx];
  const correct = idx === q.answerIdx;
  inverseSession.total++;
  if (correct) inverseSession.correct++;
  else {
    const reIdx = Math.min(inverseIdx + 3, inverseQueue.length);
    inverseQueue.splice(reIdx, 0, q);
  }
  inverseAllTime[q.id] = inverseAllTime[q.id] || { correct: 0, total: 0 };
  inverseAllTime[q.id].total++;
  if (correct) inverseAllTime[q.id].correct++;
  api('/api/log-quiz', { quizType: 'inverse', questionId: q.id, correct });
  renderInverseCard();
  renderRecallSidebar();
}

function nextInverseQuestion() {
  inverseIdx++;
  inverseAnswered = false;
  inversePicked = null;
  renderInverseCard();
  renderRecallSidebar();
}

function renderInverseSummary() {
  const panel = document.getElementById('recallPanel');
  if (!panel) return;
  const pct = inverseSession.total ? Math.round(inverseSession.correct/inverseSession.total*100) : 0;
  panel.innerHTML = `
    <div class="quiz-card quiz-summary">
      <div style="font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;font-weight:700">Inverse Session Complete</div>
      <div class="big-num">${inverseSession.correct}/${inverseSession.total}</div>
      <div class="sub">${pct}% accuracy</div>
      <button class="btn btn-primary" onclick="startInverseSession()">↻ New Session</button>
    </div>`;
}

// ── Why-questions (self-graded reasoning) ────────────────────────────────
function startWhySession() {
  whyQueue = shuffleCopy(WHY_QUESTIONS).slice(0, WHY_PER_SESSION);
  whyIdx = 0;
  whySession = { correct: 0, total: 0 };
  whyRevealed = false;
  recallSubMode = 'why';
  renderRecallSidebar();
  renderRecallContent();
}

function renderWhyCard() {
  const panel = document.getElementById('recallPanel');
  if (!panel) return;
  if (whyIdx >= whyQueue.length) { renderWhySummary(); return; }
  const q = whyQueue[whyIdx];
  const stats = whyAllTime[q.id];
  const allTimeStr = stats && stats.total ? ` · ${Math.round(stats.correct/stats.total*100)}% recalled` : '';
  const progressPct = (whyIdx / whyQueue.length) * 100;
  let body;
  if (!whyRevealed) {
    body = `
      <div class="flashcard-prompt-label">Reason it through, then reveal</div>
      <div class="why-question">${q.q}</div>
      <div class="quiz-actions" style="margin-top:18px">
        <button class="btn btn-primary" onclick="revealWhy()">🔍 Reveal Reasoning</button>
      </div>`;
  } else {
    body = `
      <div class="flashcard-prompt-label">Question</div>
      <div class="why-question faded">${q.q}</div>
      <div class="flashcard-back-label">The reasoning</div>
      <div class="flashcard-back">${q.answer}</div>
      <div class="flashcard-rating-label">Did you get the reasoning right?</div>
      <div class="why-rating">
        <button class="rating-btn again" onclick="rateWhy(false)">
          <div class="rt-label">✗ Forgot / Off</div>
        </button>
        <button class="rating-btn easy" onclick="rateWhy(true)">
          <div class="rt-label">✓ Got it</div>
        </button>
      </div>`;
  }
  panel.innerHTML = `
    <div class="quiz-card">
      <div class="quiz-bar">
        <span>Why ${whyIdx + 1} of ${whyQueue.length} · ${q.category}${allTimeStr}</span>
      </div>
      <div class="quiz-progressbar"><div style="width:${progressPct}%"></div></div>
      ${body}
    </div>`;
}

function revealWhy() {
  whyRevealed = true;
  renderWhyCard();
}

function rateWhy(correct) {
  const q = whyQueue[whyIdx];
  whySession.total++;
  if (correct) whySession.correct++;
  else {
    const reIdx = Math.min(whyIdx + 3, whyQueue.length);
    whyQueue.splice(reIdx, 0, q);
  }
  whyAllTime[q.id] = whyAllTime[q.id] || { correct: 0, total: 0 };
  whyAllTime[q.id].total++;
  if (correct) whyAllTime[q.id].correct++;
  api('/api/log-quiz', { quizType: 'why', questionId: q.id, correct });
  whyIdx++;
  whyRevealed = false;
  renderWhyCard();
  renderRecallSidebar();
}

function renderWhySummary() {
  const panel = document.getElementById('recallPanel');
  if (!panel) return;
  const pct = whySession.total ? Math.round(whySession.correct/whySession.total*100) : 0;
  panel.innerHTML = `
    <div class="quiz-card quiz-summary">
      <div style="font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;font-weight:700">Why Session Complete</div>
      <div class="big-num">${whySession.correct}/${whySession.total}</div>
      <div class="sub">${pct}% reasoning recalled</div>
      <button class="btn btn-primary" onclick="startWhySession()">↻ New Session</button>
    </div>`;
}
