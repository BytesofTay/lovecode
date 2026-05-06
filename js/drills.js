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
  else if (drillsSubMode === 'lazy' && !lazyQueue.length) startLazySession();
  else if (drillsSubMode === 'snippets' && !snippetsQueue.length) startSnippetsSession();
  else { renderDrillsSidebar(); renderDrillsContent(); }
}

function setDrillsSubMode(m) {
  drillsSubMode = m;
  // Stop the lazy timer when leaving lazy mode
  if (m !== 'lazy') stopLazyTimer();
  if (m === 'patterns' && !patternsQueue.length) startPatternsSession();
  else if (m === 'vocab' && !vocabQueue.length) startVocabSession();
  else if (m === 'lazy' && !lazyQueue.length) startLazySession();
  else if (m === 'snippets' && !snippetsQueue.length) startSnippetsSession();
  else { renderDrillsSidebar(); renderDrillsContent(); }
}

function renderDrillsContent() {
  if (drillsSubMode === 'patterns') renderPatternsCard();
  else if (drillsSubMode === 'vocab') renderVocabCard();
  else if (drillsSubMode === 'lazy') renderLazyCard();
  else if (drillsSubMode === 'snippets') renderSnippetsCard();
}

function renderDrillsSidebar() {
  const sb = document.getElementById('drillsSidebar');
  if (!sb) return;
  const mode = drillsSubMode;
  let session, queue, idx, allTime, breakdownRows, startFn, totalCount;
  if (mode === 'patterns') {
    session = patternsSession; queue = patternsQueue; idx = patternsIdx; allTime = patternsAllTime;
    totalCount = PATTERN_QUESTIONS.length;
    startFn = 'startPatternsSession()';
    breakdownRows = PATTERN_QUESTIONS.map(item => {
      const s = allTime[item.id];
      if (!s || !s.total) return '';
      const pct = Math.round(s.correct/s.total*100);
      const cls = pct >= 80 ? 'high' : pct >= 50 ? 'mid' : 'low';
      const label = item.options[item.answerIdx];
      const truncated = label.length > 26 ? label.slice(0,24)+'…' : label;
      return `<div class="stat-row"><span title="${label.replace(/"/g,'&quot;')}">${truncated}</span><span class="acc ${cls}">${pct}%</span></div>`;
    }).join('');
  } else if (mode === 'vocab') {
    session = vocabSession; queue = vocabQueue; idx = vocabIdx; allTime = vocabAllTime;
    totalCount = VOCAB_TERMS.length;
    startFn = 'startVocabSession()';
    breakdownRows = VOCAB_TERMS.map(item => {
      const id = 'v_' + item.term.replace(/[^a-z0-9]+/gi,'_');
      const s = allTime[id];
      if (!s || !s.total) return '';
      const pct = Math.round(s.correct/s.total*100);
      const cls = pct >= 80 ? 'high' : pct >= 50 ? 'mid' : 'low';
      const label = item.term;
      const truncated = label.length > 26 ? label.slice(0,24)+'…' : label;
      return `<div class="stat-row"><span title="${label.replace(/"/g,'&quot;')}">${truncated}</span><span class="acc ${cls}">${pct}%</span></div>`;
    }).join('');
  } else if (mode === 'snippets') {
    session = snippetsSession; queue = snippetsQueue; idx = snippetsIdx; allTime = snippetsAllTime;
    totalCount = SNIPPET_CHALLENGES.length;
    startFn = 'startSnippetsSession()';
    // Aggregate by pattern for the snippets breakdown
    const byPattern = {};
    SNIPPET_CHALLENGES.forEach(c => {
      const s = allTime[c.id];
      if (!s) return;
      byPattern[c.pattern] = byPattern[c.pattern] || { correct: 0, total: 0 };
      byPattern[c.pattern].correct += s.correct;
      byPattern[c.pattern].total += s.total;
    });
    breakdownRows = Object.keys(byPattern).sort().map(p => {
      const s = byPattern[p];
      const pct = Math.round(s.correct/s.total*100);
      const cls = pct >= 80 ? 'high' : pct >= 50 ? 'mid' : 'low';
      const label = p.length > 26 ? p.slice(0,24)+'…' : p;
      return `<div class="stat-row"><span title="${p.replace(/"/g,'&quot;')}">${label}</span><span class="acc ${cls}">${pct}% (${s.correct}/${s.total})</span></div>`;
    }).join('');
  } else { // lazy
    session = lazySession; queue = lazyQueue; idx = lazyIdx; allTime = lazyAllTime;
    totalCount = LAZY_FLASHCARDS.length;
    startFn = 'startLazySession()';
    // Aggregate by category for the lazy breakdown
    const byCat = {};
    LAZY_CATEGORIES.forEach(c => byCat[c] = { correct: 0, total: 0 });
    LAZY_FLASHCARDS.forEach(card => {
      const s = allTime[card.id];
      if (!s) return;
      byCat[card.category].correct += s.correct;
      byCat[card.category].total += s.total;
    });
    breakdownRows = LAZY_CATEGORIES.map(c => {
      const s = byCat[c];
      if (!s.total) return `<div class="stat-row"><span>${LAZY_CATEGORY_LABELS[c]}</span><span class="acc" style="color:var(--muted)">—</span></div>`;
      const pct = Math.round(s.correct/s.total*100);
      const cls = pct >= 80 ? 'high' : pct >= 50 ? 'mid' : 'low';
      return `<div class="stat-row"><span>${LAZY_CATEGORY_LABELS[c]}</span><span class="acc ${cls}">${pct}% (${s.correct}/${s.total})</span></div>`;
    }).join('');
  }
  const total = Object.values(allTime).reduce((s,x)=>s+x.total,0);
  const correct = Object.values(allTime).reduce((s,x)=>s+x.correct,0);
  const overallPct = total ? Math.round(correct/total*100) : 0;
  const sessPct = session.total ? Math.round(session.correct/session.total*100) : 0;
  // Lazy filter chips (only in lazy mode)
  let lazyFilterChips = '';
  if (mode === 'lazy') {
    const cats = LAZY_CATEGORIES.concat(['all']);
    lazyFilterChips = `<div class="lazy-filters">
      <div class="lazy-filters-label">Focus drill on:</div>
      ${cats.map(c => {
        const label = c === 'all' ? '🎲 All Mixed' : LAZY_CATEGORY_LABELS[c];
        const active = lazyFilter === c ? ' active' : '';
        return `<button class="lazy-filter-chip${active}" onclick="setLazyFilter('${c}')">${label}</button>`;
      }).join('')}
    </div>`;
  }
  sb.innerHTML = `
    <div class="submode-toggle four-tab">
      <button class="submode-btn ${mode==='patterns'?'active':''}" onclick="setDrillsSubMode('patterns')">🧠 Patterns</button>
      <button class="submode-btn ${mode==='vocab'?'active':''}" onclick="setDrillsSubMode('vocab')">📖 Vocab</button>
      <button class="submode-btn ${mode==='snippets'?'active':''}" onclick="setDrillsSubMode('snippets')">🧩 Snippets</button>
      <button class="submode-btn ${mode==='lazy'?'active':''}" onclick="setDrillsSubMode('lazy')">😎 Lazy</button>
    </div>
    ${lazyFilterChips}
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

// ── Lazy session ──────────────────────────────────────────────────────────
const COMPLEXITY_POOL = ['O(1)','O(log n)','O(n)','O(n log n)','O(n²)','O(n³)','O(2ⁿ)','O(n!)','O(n · 2ⁿ)','O(α(n))','O(n + m)','O(m × n)'];
const PATTERN_POOL = ['Two Pointers','Hash Map','Sliding Window','Binary Search','BFS','DFS','Backtracking','Dynamic Programming','Greedy','Heap (Top K pattern)','Stack','Monotonic Stack','Topological Sort (Kahn\'s)','Union-Find','Prefix Sum','Memoization (top-down DP)','Floyd\'s Tortoise and Hare','Reverse Linked List (three-pointer flip)','Quick Sort','Merge Sort','In-order tree traversal','Kadane\'s Algorithm (Maximum Subarray)'];

// Explanation lookups for wrong-answer feedback
const COMPLEXITY_WHY = {
  'O(1)': 'Constant time — work doesn\'t grow with input size. Example: <code>arr[i]</code>, hash-map get, <code>len(arr)</code>.',
  'O(log n)': 'Logarithmic — you halve the search space each step. Example: binary search; recursion that halves <code>n</code>.',
  'O(n)': 'Linear — one pass through the data. Example: a single <code>for</code> loop over n items.',
  'O(n log n)': 'Linearithmic — typical of efficient sorts. Example: merge sort; "loop with binary search inside."',
  'O(n²)': 'Quadratic — two nested loops over n, or comparing every pair. Example: bubble sort; brute-force pair search.',
  'O(n³)': 'Cubic — three nested loops. Example: 4Sum brute force; naive matrix multiplication.',
  'O(2ⁿ)': 'Exponential — recursion that branches into 2 calls per step without caching. Example: enumerating subsets; naive Fibonacci.',
  'O(n!)': 'Factorial — generating every permutation. Example: brute-force traveling salesman; permute(arr).',
  'O(n · 2ⁿ)': 'Generating all 2ⁿ subsets and copying each (length n). Example: Subsets problem.',
  'O(α(n))': 'Inverse Ackermann — effectively constant in practice. Example: Union-Find with path compression + union-by-rank.',
  'O(n + m)': 'Sum complexity — sequential (not nested) loops over different inputs of size n and m.',
  'O(m × n)': 'Product complexity — nested loops where outer is m and inner is n.'
};

const PATTERN_WHY = {
  'Two Pointers': 'Fits sorted arrays where you converge from both ends, OR linked lists with fast/slow speeds.',
  'Hash Map': 'Fits "have I seen this before?" or "count of each thing" problems — O(1) average lookup.',
  'Sliding Window': 'Fits longest/shortest contiguous-subarray problems — expand right, shrink left when invariant breaks.',
  'Binary Search': 'Fits sorted arrays OR "smallest x that satisfies f(x)" on a monotonic predicate.',
  'BFS': 'Fits shortest path in unweighted graphs OR level-order traversal.',
  'DFS': 'Fits tree traversal, cycle detection, or "explore all paths" problems.',
  'Backtracking': 'Fits combinatorial search: subsets, permutations, N-Queens. Choose → recurse → un-choose.',
  'Dynamic Programming': 'Fits problems with overlapping subproblems and optimal substructure. Cache subproblem answers.',
  'Greedy': 'Fits problems where the locally best choice provably leads to the global optimum.',
  'Heap (Top K pattern)': 'Fits "top K" or "always need next-smallest/largest" — heap of size K → O(n log K).',
  'Stack': 'Fits LIFO / matching problems: balanced parentheses, function call simulation, undo.',
  'Monotonic Stack': 'Fits "next greater/smaller element" problems in O(n) — pops while order would be violated.',
  'Topological Sort (Kahn\'s)': 'Fits scheduling with dependencies (DAGs) — Course Schedule, build order.',
  'Union-Find': 'Fits connected-components problems and dynamic connectivity queries.',
  'Prefix Sum': 'Fits "many range-sum queries on an immutable array" — O(n) preprocess, O(1) per query.',
  'Memoization (top-down DP)': 'Fits naturally recursive problems where the same subproblem is solved many times.',
  'Floyd\'s Tortoise and Hare': 'Fits cycle detection in linked lists with O(1) extra space.',
  'Reverse Linked List (three-pointer flip)': 'Fits in-place linked list reversal — prev/curr/next pointer dance.',
  'Quick Sort': 'Fits in-place sorting where average performance matters more than worst case.',
  'Merge Sort': 'Fits stable sorting OR sorting linked lists (no random access needed).',
  'In-order tree traversal': 'Fits BSTs when you want elements in sorted order. Visit left → root → right.',
  'Kadane\'s Algorithm (Maximum Subarray)': 'Fits "maximum sum contiguous subarray" — track running sum, reset on negative.'
};

// Returns a "what this option means + example" rationale for any option.
function getOptionRationale(card, optIdx) {
  const cat = card.category;
  const opt = card.options[optIdx];
  if (cat === 'code-complexity' || cat === 'quick-concept') {
    return COMPLEXITY_WHY[opt] || '';
  }
  if (cat === 'code-pattern') {
    return PATTERN_WHY[opt] || '';
  }
  if (cat === 'desc-to-term') {
    const otherCard = LAZY_FLASHCARDS.find(c => c.format === 'flash' && c.category === 'desc-to-term' && c.back === opt);
    return otherCard ? otherCard.front : '';
  }
  if (cat === 'term-to-desc') {
    const otherCard = LAZY_FLASHCARDS.find(c => c.format === 'flash' && c.category === 'term-to-desc' && c.back === opt);
    if (otherCard) return `Belongs to: <strong>${otherCard.front.replace(/<[^>]+>/g,'')}</strong>`;
    return '';
  }
  return '';
}

// Builds the full per-option breakdown: each option labeled correct/wrong with its rationale and example.
function buildOptionBreakdown(card) {
  const rows = card.options.map((opt, i) => {
    const isCorrect = i === card.answerIdx;
    const rationale = getOptionRationale(card, i);
    if (!rationale) return '';
    const cls = isCorrect ? 'opt-row correct' : 'opt-row wrong';
    const marker = isCorrect ? '✓' : '✗';
    return `<div class="${cls}">
      <div class="opt-row-header"><span class="opt-marker">${marker}</span><span class="opt-text">${opt}</span></div>
      <div class="opt-rationale">${rationale}</div>
    </div>`;
  }).filter(Boolean).join('');
  if (!rows) return '';
  return `<div class="option-breakdown">
    <div class="option-breakdown-label">What each option means</div>
    ${rows}
  </div>`;
}

function pickDistractors(correct, pool, n = 2) {
  const candidates = pool.filter(x => x !== correct);
  const out = [];
  const used = new Set();
  while (out.length < n && candidates.length) {
    const i = Math.floor(Math.random() * candidates.length);
    if (used.has(i)) continue;
    used.add(i);
    out.push(candidates[i]);
    if (used.size >= candidates.length) break;
  }
  return out;
}

// Convert a flash-format card to MC by generating 2 distractor options.
function flashToMC(card) {
  const cat = card.category;
  let pool = [];
  if (cat === 'code-complexity' || cat === 'quick-concept') {
    pool = COMPLEXITY_POOL;
  } else if (cat === 'code-pattern') {
    pool = PATTERN_POOL;
  } else if (cat === 'desc-to-term') {
    // Other terms in the same desc-to-term category
    pool = LAZY_FLASHCARDS.filter(c => c.format === 'flash' && c.category === 'desc-to-term').map(c => c.back);
  } else if (cat === 'term-to-desc') {
    pool = LAZY_FLASHCARDS.filter(c => c.format === 'flash' && c.category === 'term-to-desc').map(c => c.back);
  }
  const distractors = pickDistractors(card.back, pool, 2);
  const options = shuffleCopy([card.back, ...distractors]);
  return {
    ...card,
    options,
    answerIdx: options.indexOf(card.back),
    explanation: card.detail || '',
    // Keep `back` in case we need it for feedback
  };
}

function buildLazyQueue() {
  const filtered = lazyFilter === 'all'
    ? LAZY_FLASHCARDS
    : LAZY_FLASHCARDS.filter(c => c.category === lazyFilter);
  const sample = shuffleCopy(filtered).slice(0, LAZY_PER_SESSION);
  // Convert flash-format to MC at session start so distractors are different each time
  return sample.map(c => c.format === 'flash' ? flashToMC(c) : c);
}

function startLazySession() {
  lazyQueue = buildLazyQueue();
  lazyIdx = 0;
  lazySession = { correct: 0, total: 0 };
  lazyAnswered = false;
  lazyPicked = null;
  drillsSubMode = 'lazy';
  startLazyTimer();
  renderDrillsSidebar();
  renderDrillsContent();
}

function setLazyFilter(cat) {
  lazyFilter = cat;
  startLazySession();
}

// ── Lazy timer (20 minutes) ────────────────────────────────────────────────
function startLazyTimer() {
  stopLazyTimer();
  lazyTimerSecs = 1200;
  lazyTimerExpired = false;
  lazyTimerInterval = setInterval(() => {
    lazyTimerSecs--;
    updateLazyTimerDisplay();
    if (lazyTimerSecs <= 0) {
      stopLazyTimer();
      lazyTimerExpired = true;
      try { playAlarm(); } catch (_) {}
      updateLazyTimerDisplay();
    }
  }, 1000);
  updateLazyTimerDisplay();
}

function stopLazyTimer() {
  if (lazyTimerInterval) {
    clearInterval(lazyTimerInterval);
    lazyTimerInterval = null;
  }
}

function updateLazyTimerDisplay() {
  const el = document.getElementById('lazyTimerDisplay');
  if (!el) return;
  if (lazyTimerExpired) {
    el.innerHTML = `⏰ <span style="color:var(--hard);font-weight:700">Time's up!</span>`;
    return;
  }
  const m = Math.floor(lazyTimerSecs / 60);
  const s = lazyTimerSecs % 60;
  const cls = lazyTimerSecs <= 60 ? 'danger' : lazyTimerSecs <= 300 ? 'warn' : '';
  el.innerHTML = `<span class="lazy-timer-time ${cls}">${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}</span>`;
}

function renderLazyCard() {
  const panel = document.getElementById('drillsPanel');
  if (!panel) return;
  if (lazyIdx >= lazyQueue.length) { renderLazySummary(); return; }
  const q = lazyQueue[lazyIdx];
  const stats = lazyAllTime[q.id];
  const allTimeStr = stats && stats.total ? ` · seen ${stats.total}× · ${Math.round(stats.correct/stats.total*100)}% correct` : '';
  const progressPct = (lazyIdx / lazyQueue.length) * 100;
  const levelPill = q.level ? `<span class="level-pill ${q.level}">${q.level}</span>` : '';
  const catLabel = LAZY_CATEGORY_LABELS[q.category] || q.category;

  const buttons = q.options.map((opt, i) => {
    let cls = 'btn-mc';
    if (lazyAnswered) {
      if (i === q.answerIdx) cls += ' correct';
      else if (i === lazyPicked) cls += ' wrong';
    }
    return `<button class="${cls}" ${lazyAnswered?'disabled':''} onclick="pickLazyAnswer(${i})">${opt}</button>`;
  }).join('');
  let feedback = '';
  if (lazyAnswered) {
    const right = lazyPicked === q.answerIdx;
    const correctAns = q.options[q.answerIdx];
    feedback = `<div class="quiz-feedback ${right?'right':'wrong'}">
      ${right ? '✓ Correct.' : `✗ The answer is: <b>${correctAns}</b>`}
      ${q.explanation ? `<div class="exp">${q.explanation}</div>` : ''}
    </div>
    ${buildOptionBreakdown(q)}
    <div class="quiz-actions">
      <button class="btn btn-primary" onclick="nextLazyQuestion()">${lazyIdx === lazyQueue.length - 1 ? 'See Results' : 'Next →'}</button>
    </div>`;
  }

  panel.innerHTML = `
    <div class="quiz-card">
      <div class="lazy-timer-row">
        <span class="lazy-timer-label">⏱ Session timer</span>
        <span id="lazyTimerDisplay"></span>
      </div>
      <div class="quiz-bar">
        <span>Card ${lazyIdx + 1} of ${lazyQueue.length} · ${catLabel}${allTimeStr}</span>
        ${levelPill}
      </div>
      <div class="quiz-progressbar"><div style="width:${progressPct}%"></div></div>
      <div class="example-problem" style="margin-bottom:18px">${q.front}</div>
      <div class="mc-options">${buttons}</div>
      ${feedback}
    </div>`;
  updateLazyTimerDisplay();
}

function pickLazyAnswer(idx) {
  if (lazyAnswered) return;
  lazyAnswered = true;
  lazyPicked = idx;
  const q = lazyQueue[lazyIdx];
  const correct = idx === q.answerIdx;
  lazySession.total++;
  if (correct) lazySession.correct++;
  else {
    const reIdx = Math.min(lazyIdx + 3, lazyQueue.length);
    lazyQueue.splice(reIdx, 0, q);
  }
  lazyAllTime[q.id] = lazyAllTime[q.id] || { correct: 0, total: 0 };
  lazyAllTime[q.id].total++;
  if (correct) lazyAllTime[q.id].correct++;
  api('/api/log-quiz', { quizType: 'lazy', questionId: q.id, correct });
  renderLazyCard();
  renderDrillsSidebar();
}

function nextLazyQuestion() {
  lazyIdx++;
  lazyAnswered = false;
  lazyPicked = null;
  renderLazyCard();
  renderDrillsSidebar();
}

function renderLazySummary() {
  const panel = document.getElementById('drillsPanel');
  if (!panel) return;
  const pct = lazySession.total ? Math.round(lazySession.correct/lazySession.total*100) : 0;
  panel.innerHTML = `
    <div class="quiz-card quiz-summary">
      <div style="font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;font-weight:700">Lazy Session Complete</div>
      <div class="big-num">${lazySession.correct}/${lazySession.total}</div>
      <div class="sub">${pct}% accuracy</div>
      <button class="btn btn-primary" onclick="startLazySession()">↻ New Session</button>
    </div>`;
}


// ── Snippets session (fill-in-the-blank) ──────────────────────────────────
function startSnippetsSession() {
  snippetsQueue = shuffleCopy(SNIPPET_CHALLENGES).slice(0, SNIPPETS_PER_SESSION);
  snippetsIdx = 0;
  snippetsSession = { correct: 0, total: 0 };
  snippetsAnswered = false;
  snippetsPicked = null;
  drillsSubMode = 'snippets';
  renderDrillsSidebar();
  renderDrillsContent();
}

function renderSnippetsCard() {
  const panel = document.getElementById('drillsPanel');
  if (!panel) return;
  if (snippetsIdx >= snippetsQueue.length) { renderSnippetsSummary(); return; }
  const q = snippetsQueue[snippetsIdx];
  const stats = snippetsAllTime[q.id];
  const allTimeStr = stats && stats.total ? ` · ${Math.round(stats.correct/stats.total*100)}% correct` : '';
  const progressPct = (snippetsIdx / snippetsQueue.length) * 100;
  const escape = (s) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  // Render code with the {{1}} blank highlighted
  const parts = q.code.split('{{1}}');
  const blankToken = snippetsAnswered
    ? `<span class="snippet-filled ${snippetsPicked === q.answerIdx ? 'right' : 'wrong'}">${escape(q.options[snippetsPicked])}</span>`
    : `<span class="snippet-blank">▢▢▢▢▢</span>`;
  const codeHtml = `<pre class="snippet-code">${escape(parts[0] || '')}${blankToken}${escape(parts[1] || '')}</pre>`;
  const buttons = q.options.map((opt, i) => {
    let cls = 'btn-mc snippet-opt';
    if (snippetsAnswered) {
      if (i === q.answerIdx) cls += ' correct';
      else if (i === snippetsPicked) cls += ' wrong';
    }
    return `<button class="${cls}" ${snippetsAnswered?'disabled':''} onclick="pickSnippetAnswer(${i})"><code>${escape(opt)}</code></button>`;
  }).join('');
  let feedback = '';
  if (snippetsAnswered) {
    const right = snippetsPicked === q.answerIdx;
    feedback = `<div class="quiz-feedback ${right?'right':'wrong'}">
      ${right ? '✓ Correct.' : `✗ The correct fill is: <code>${escape(q.options[q.answerIdx])}</code>`}
      <div class="exp">${q.explanation}</div>
    </div>
    <div class="quiz-actions">
      <button class="btn btn-primary" onclick="nextSnippetQuestion()">${snippetsIdx === snippetsQueue.length - 1 ? 'See Results' : 'Next →'}</button>
    </div>`;
  }
  const levelPill = q.level ? `<span class="level-pill ${q.level}">${q.level}</span>` : '';
  panel.innerHTML = `
    <div class="quiz-card">
      <div class="quiz-bar">
        <span>Snippet ${snippetsIdx + 1} of ${snippetsQueue.length} · LeetCode: <strong>${q.problem}</strong>${allTimeStr}</span>
        ${levelPill}
      </div>
      <div class="quiz-progressbar"><div style="width:${progressPct}%"></div></div>
      <div class="snippet-problem-heading">
        <div class="snippet-problem-name">${q.problem}</div>
        <div class="snippet-pattern-tag">${q.pattern}</div>
      </div>
      <div class="example-problem" style="margin-bottom:14px">${q.brief}</div>
      ${codeHtml}
      <div class="snippet-prompt">Pick the correct fill for the blank:</div>
      <div class="snippet-options">${buttons}</div>
      ${feedback}
    </div>`;
}

function pickSnippetAnswer(idx) {
  if (snippetsAnswered) return;
  snippetsAnswered = true;
  snippetsPicked = idx;
  const q = snippetsQueue[snippetsIdx];
  const correct = idx === q.answerIdx;
  snippetsSession.total++;
  if (correct) snippetsSession.correct++;
  else {
    const reIdx = Math.min(snippetsIdx + 3, snippetsQueue.length);
    snippetsQueue.splice(reIdx, 0, q);
  }
  snippetsAllTime[q.id] = snippetsAllTime[q.id] || { correct: 0, total: 0 };
  snippetsAllTime[q.id].total++;
  if (correct) snippetsAllTime[q.id].correct++;
  api('/api/log-quiz', { quizType: 'snippet', questionId: q.id, correct });
  renderSnippetsCard();
  renderDrillsSidebar();
}

function nextSnippetQuestion() {
  snippetsIdx++;
  snippetsAnswered = false;
  snippetsPicked = null;
  renderSnippetsCard();
  renderDrillsSidebar();
}

function renderSnippetsSummary() {
  const panel = document.getElementById('drillsPanel');
  if (!panel) return;
  const pct = snippetsSession.total ? Math.round(snippetsSession.correct/snippetsSession.total*100) : 0;
  panel.innerHTML = `
    <div class="quiz-card quiz-summary">
      <div style="font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;font-weight:700">Snippet Session Complete</div>
      <div class="big-num">${snippetsSession.correct}/${snippetsSession.total}</div>
      <div class="sub">${pct}% accuracy</div>
      <button class="btn btn-primary" onclick="startSnippetsSession()">↻ New Session</button>
    </div>`;
}
