// ── Mode switching + bootstrap ─────────────────────────────────────────────

function switchMode(mode) {
  currentMode = mode;
  // Stop lazy timer when leaving drills mode entirely
  if (mode !== 'drills' && typeof stopLazyTimer === 'function') stopLazyTimer();
  document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + mode).classList.add('active');
  const m = document.getElementById('appMain');
  m.className = 'mode-' + mode;
  if (mode === 'problems') renderProblemsMode();
  else if (mode === 'bigo') renderBigoMode();
  else if (mode === 'sorting') renderSortingMode();
  else if (mode === 'learn') renderLearnMode();
  else if (mode === 'drills') renderDrillsMode();
  else if (mode === 'mock') renderMockMode();
}

async function init() {
  const sheetId = localStorage.getItem('b75_sheet');
  if (sheetId) {
    try { problems = await loadSheets(sheetId); }
    catch (e) { console.warn('Sheets load failed, using built-in data'); problems = [...PROBLEMS]; }
  } else {
    problems = [...PROBLEMS];
  }

  const cats = [...new Set(problems.map(p => p.category))];
  document.getElementById('fCat').innerHTML =
    '<option value="All">All Categories</option>' + cats.map(c => `<option>${c}</option>`).join('');

  try {
    const state = await fetch('/api/state').then(r => r.json());
    done = new Set(state.done || []);
    review = new Set(state.review || []);
    problemData = state.problems || {};
    const quizData = state.quiz || {};
    bigoAllTime = {};
    for (const [qid, qd] of Object.entries(quizData.bigo || {})) {
      const a = qd.attempts || [];
      bigoAllTime[qid] = { total: a.length, correct: a.filter(x => x.correct).length };
    }
    sortingAllTime = {};
    for (const [qid, qd] of Object.entries(quizData.sorting || {})) {
      const a = qd.attempts || [];
      sortingAllTime[qid] = { total: a.length, correct: a.filter(x => x.correct).length };
    }
    patternsAllTime = {};
    for (const [qid, qd] of Object.entries(quizData.pattern || {})) {
      const a = qd.attempts || [];
      patternsAllTime[qid] = { total: a.length, correct: a.filter(x => x.correct).length };
    }
    vocabAllTime = {};
    for (const [qid, qd] of Object.entries(quizData.vocab || {})) {
      const a = qd.attempts || [];
      vocabAllTime[qid] = { total: a.length, correct: a.filter(x => x.correct).length };
    }
    lazyAllTime = {};
    for (const [qid, qd] of Object.entries(quizData.lazy || {})) {
      const a = qd.attempts || [];
      lazyAllTime[qid] = { total: a.length, correct: a.filter(x => x.correct).length };
    }
    learningState = state.learning || {};
    mockHistory = state.mockHistory || [];
  } catch (e) {
    console.error('Could not reach server:', e);
    document.getElementById('pText').textContent = '⚠ Server offline';
  }

  // Default landing: Learn
  switchMode('learn');
}

init();
