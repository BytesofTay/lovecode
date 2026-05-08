// ── Mode switching + bootstrap ─────────────────────────────────────────────

function switchMode(mode) {
  currentMode = mode;
  // Stop lazy timer when leaving drills mode entirely
  if (mode !== 'drills' && typeof stopLazyTimer === 'function') stopLazyTimer();
  if (mode !== 'sorting' && typeof tracePause === 'function') tracePause();
  document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + mode).classList.add('active');
  const m = document.getElementById('appMain');
  m.className = 'mode-' + mode;
  if (mode === 'problems') renderProblemsMode();
  else if (mode === 'bigo') renderBigoMode();
  else if (mode === 'sorting') renderSortingMode();
  else if (mode === 'learn') renderLearnMode();
  else if (mode === 'drills') renderDrillsMode();
  else if (mode === 'build') renderBuildMode();
  else if (mode === 'recall') renderRecallMode();
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
    snippetsAllTime = {};
    for (const [qid, qd] of Object.entries(quizData.snippet || {})) {
      const a = qd.attempts || [];
      snippetsAllTime[qid] = { total: a.length, correct: a.filter(x => x.correct).length };
    }
    parsonsAllTime = {};
    for (const [qid, qd] of Object.entries(quizData.parsons || {})) {
      const a = qd.attempts || [];
      parsonsAllTime[qid] = { total: a.length, correct: a.filter(x => x.correct).length };
    }
    guidedAllTime = {};
    for (const [qid, qd] of Object.entries(quizData.guided || {})) {
      // Only include problem-level entries (no "__d" decision suffix)
      if (qid.includes('__d')) continue;
      const a = qd.attempts || [];
      guidedAllTime[qid] = { total: a.length, correct: a.filter(x => x.correct).length };
    }
    templatesAllTime = {};
    for (const [qid, qd] of Object.entries(quizData.template || {})) {
      if (qid.includes('__b')) continue;
      const a = qd.attempts || [];
      templatesAllTime[qid] = { total: a.length, correct: a.filter(x => x.correct).length };
    }
    flashcardsAllTime = {};
    for (const [qid, qd] of Object.entries(quizData.flashcard || {})) {
      const a = qd.attempts || [];
      flashcardsAllTime[qid] = { total: a.length, correct: a.filter(x => x.correct).length };
    }
    inverseAllTime = {};
    for (const [qid, qd] of Object.entries(quizData.inverse || {})) {
      const a = qd.attempts || [];
      inverseAllTime[qid] = { total: a.length, correct: a.filter(x => x.correct).length };
    }
    whyAllTime = {};
    for (const [qid, qd] of Object.entries(quizData.why || {})) {
      const a = qd.attempts || [];
      whyAllTime[qid] = { total: a.length, correct: a.filter(x => x.correct).length };
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
