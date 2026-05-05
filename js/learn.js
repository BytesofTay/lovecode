function renderLearnMode() {
  if (learnView === 'detail' && learnTopicId) renderTopicDetail(learnTopicId);
  else renderTopicMap();
}

function renderTopicMap() {
  learnView = 'map';
  const sections = ['Foundations', 'Data Structures', 'Patterns'];
  const grouped = {};
  sections.forEach(s => grouped[s] = []);
  const advancedTopics = [];
  LEARNING_TOPICS.forEach(t => {
    if (t.advanced) advancedTopics.push(t);
    else grouped[t.section].push(t);
  });
  const sectionsHtml = sections.map(s => {
    const items = grouped[s].slice();
    // Capstone topics always render last within their section
    items.sort((a, b) => {
      const rank = (t) => t.capstone ? 2 : t.optional ? 1 : 0;
      return rank(a) - rank(b);
    });
    if (!items.length) return '';
    const cls = s.toLowerCase().replace(' ', '-');
    return `
      <div class="section-label ${cls}">${s}</div>
      <div class="topic-grid">
        ${items.map(t => topicCardHtml(t)).join('')}
      </div>`;
  }).join('');

  const advancedCount = advancedTopics.length;
  const advancedHtml = advancedCount ? `
    <details class="advanced-section">
      <summary>
        <span class="adv-chev">▸</span>
        <span class="adv-title">Advanced topics</span>
        <span class="adv-tag">OPTIONAL</span>
        <span class="adv-count">${advancedCount} topic${advancedCount === 1 ? '' : 's'}</span>
      </summary>
      <p class="adv-blurb">These go beyond the Blind 75 — segment trees, KMP, monotonic deque, line sweep. Useful for hard-tier interviews, but skip them until the core sections feel solid.</p>
      <div class="topic-grid">
        ${advancedTopics.map(t => topicCardHtml(t)).join('')}
      </div>
    </details>` : '';

  document.getElementById('appMain').innerHTML = `
    <div class="learn-container">
      <div class="learn-header">
        <h2>Learn the concepts first</h2>
        <p>Visual intros, short videos, and key takeaways. When you're ready, jump into practice.</p>
      </div>
      ${sectionsHtml}
      ${advancedHtml}
    </div>`;
}

function topicCardHtml(t) {
  const state = learningState[t.id] || {};
  const cls = t.section.toLowerCase().replace(' ', '-');
  const iconSvg = (SVGS[t.cardIcon] || SVGS[t.diagram] || (() => ''))();
  let badge = '';
  if (state.complete) badge = '<span class="badge-status complete" title="Understood">✓</span>';
  else if (state.videoWatched) badge = '<span class="badge-status watched" title="Watched">👁</span>';
  else badge = '<span class="badge-status" style="color:var(--muted)" title="Not started">○</span>';
  let tag = '';
  if (t.capstone) tag = '<span class="tag-capstone" title="Capstone topic">CAPSTONE</span>';
  else if (t.advanced) tag = '<span class="tag-advanced" title="Hard-tier advanced topic">ADVANCED</span>';
  else if (t.optional) tag = '<span class="tag-optional" title="Optional topic">OPTIONAL</span>';
  const optionalCls = t.optional ? ' optional' : '';
  return `
    <div class="topic-card ${cls}${optionalCls}" onclick="goToTopic('${t.id}')">
      <div class="card-icon">${iconSvg}</div>
      <div class="card-body">
        <div class="card-title">${t.title} ${tag}${badge}</div>
        <div class="card-summary">${t.summary}</div>
        <div class="card-meta">
          <span class="card-time">⏱ ${t.estMin} min</span>
          <span>${t.section}</span>
        </div>
      </div>
    </div>`;
}

function corePrereqProgress() {
  const core = LEARNING_TOPICS.filter(t => !t.capstone && !t.optional && !t.advanced);
  const complete = core.filter(t => (learningState[t.id] || {}).complete).length;
  return { complete, total: core.length, pct: Math.round(complete / core.length * 100) };
}

function capstoneGateHtml() {
  const p = corePrereqProgress();
  const ready = p.complete >= p.total;
  return `<div class="capstone-gate">
    <div class="gate-title">${ready ? '✓ You\'re ready' : '🔒 Capstone — finish the other topics first'}</div>
    <p>${ready
      ? 'You\'ve marked all core topics as understood. DP is the natural next step — it builds on recursion, memoization, and pattern recognition you\'ve already practiced.'
      : 'Dynamic Programming pulls together recursion, memoization, and pattern recognition from earlier topics. Mark the core topics as ✓ Understood before tackling DP — you\'ll struggle without that foundation.'}</p>
    <div class="gate-bar"><div style="width:${p.pct}%"></div></div>
    <p style="margin-top: 4px; font-size: 11px; color: var(--muted);">${p.complete} of ${p.total} core topics complete · ${p.pct}%${ready ? '' : ' — Bit Manipulation is optional and doesn\'t count.'}</p>
  </div>`;
}

function goToTopic(id) {
  learnTopicId = id;
  learnView = 'detail';
  // Clear comprehension state for this topic so each visit picks fresh questions from the pool
  Object.keys(comprehensionSelected).forEach(k => { if (k.startsWith(id + '-')) delete comprehensionSelected[k]; });
  Object.keys(comprehensionAnswers).forEach(k => { if (k.startsWith(id + '-')) delete comprehensionAnswers[k]; });
  renderTopicDetail(id);
  api('/api/learning', { topicId: id, field: 'lastVisited', value: Date.now() });
}

function backToMap() {
  learnView = 'map';
  learnTopicId = null;
  renderTopicMap();
}

function toggleLazyMode() {
  lazyModeOn = !lazyModeOn;
  try { localStorage.setItem('lovecode_lazy_mode', JSON.stringify(lazyModeOn)); } catch (_) {}
  if (learnView === 'detail' && learnTopicId) renderTopicDetail(learnTopicId);
  else renderTopicMap();
}

function topicProgress(t) {
  const p = t.practice || {};
  if (p.type === 'bigo') {
    // For Big-O topic: aggregate across all complexity classes
    const total = Object.values(bigoAllTime).reduce((s, x) => s + x.total, 0);
    const correct = Object.values(bigoAllTime).reduce((s, x) => s + x.correct, 0);
    if (!total) return null;
    return { label: 'Big-O quiz accuracy', correct, total, pct: Math.round(correct/total*100) };
  }
  if (p.type === 'sorting') {
    const total = Object.values(sortingAllTime).reduce((s, x) => s + x.total, 0);
    const correct = Object.values(sortingAllTime).reduce((s, x) => s + x.correct, 0);
    if (!total) return null;
    return { label: 'Sorting quiz accuracy', correct, total, pct: Math.round(correct/total*100) };
  }
  if (p.type === 'problems') {
    let matching = problems;
    if (p.filter && p.filter.category) matching = matching.filter(x => x.category === p.filter.category);
    if (p.filter && p.filter.ds) matching = matching.filter(x => x.ds === p.filter.ds);
    if (!matching.length) return null;
    const doneCount = matching.filter(x => done.has(x.id)).length;
    return { label: 'Problems solved', correct: doneCount, total: matching.length, pct: Math.round(doneCount/matching.length*100) };
  }
  return null;
}

function progressBarHtml(prog) {
  if (!prog) return '';
  const cls = prog.pct >= 80 ? 'high' : prog.pct >= 50 ? 'mid' : 'low';
  return `<div style="margin: 14px 0 22px; padding: 12px 16px; background: var(--surface); border: 1px solid var(--border); border-radius: 10px;">
    <div style="font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; font-weight: 700;">Your progress · ${prog.label}</div>
    <div style="display: flex; align-items: center; gap: 10px;">
      <div style="flex: 1; height: 6px; background: var(--border); border-radius: 3px; overflow: hidden;">
        <div class="bar-fill ${cls}" style="height:100%; width:${prog.pct}%; border-radius: 3px;"></div>
      </div>
      <div style="font-size: 13px; font-variant-numeric: tabular-nums; font-weight: 600; color: ${prog.pct >= 80 ? 'var(--easy)' : prog.pct >= 50 ? 'var(--medium)' : 'var(--hard)'};">${prog.correct}/${prog.total} · ${prog.pct}%</div>
    </div>
  </div>`;
}

function examplesHtml(examples, topicId) {
  const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const cards = examples.map((ex, i) => {
    const linkedProblem = ex.problemId ? problems.find(p => p.id === ex.problemId) : null;
    const cta = linkedProblem
      ? `<button class="btn btn-ghost example-cta" onclick="goToProblemFromTopic(${ex.problemId})">→ Try it on Blind 75 ▸ ${linkedProblem.name}</button>`
      : '';
    return `<div class="example-card">
      <div class="example-title">
        <span class="example-num">EXAMPLE ${i + 1}</span>
        <span>${ex.title}</span>
      </div>
      <div class="example-problem">${ex.problem}</div>
      ${ex.approach ? `<div class="example-approach">${ex.approach}</div>` : ''}
      ${ex.code ? `<pre>${escape(ex.code)}</pre>` : ''}
      <div class="example-meta">
        ${ex.time ? `<span class="badge time">Time: ${ex.time}</span>` : ''}
        ${ex.space ? `<span class="badge space">Space: ${ex.space}</span>` : ''}
      </div>
      ${ex.why ? `<div class="example-why">${ex.why}</div>` : ''}
      ${cta}
      ${exampleExtrasHtml(topicId, i, ex)}
      ${comprehensionHtml(topicId, i)}
    </div>`;
  }).join('');
  return `<div class="examples-section">
    <h3>Worked Examples</h3>
    ${cards}
  </div>`;
}

// In-memory comprehension state (per topic + example index + level)
const comprehensionAnswers = {};

// In-memory line-walk + typing state (per topic + example index)
const lineWalkOpen = {};   // key 'topicId-exIdx' → bool
const typingOpen = {};     // key 'topicId-exIdx' → bool
const typingInputs = {};   // key 'topicId-exIdx' → string (user's typed code)
const typingRefShown = {}; // key 'topicId-exIdx' → bool

function lineAnnotationsHtml(topicId, exIdx, code) {
  const annotations = (EXAMPLE_ANNOTATIONS[`${topicId}-${exIdx}`] || []);
  const lines = code.split('\n');
  const escape = (s) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const rows = lines.map((line, i) => {
    const ann = annotations[i];
    return `<div class="line-row">
      <div class="line-num">${i + 1}</div>
      <div class="line-content">
        <div class="line-code">${escape(line) || '&nbsp;'}</div>
        <div class="line-explain ${ann?'':'empty'}">${ann || '(no annotation for this line yet)'}</div>
      </div>
    </div>`;
  }).join('');
  return `<div class="line-annotations">
    <h5>💡 Line-by-line walkthrough</h5>
    ${rows}
  </div>`;
}

function typingSectionHtml(topicId, exIdx, code) {
  const key = `${topicId}-${exIdx}`;
  const typed = typingInputs[key] || '';
  const refShown = typingRefShown[key];
  // Compute simple diff stats
  let diffSummary = '';
  if (typed.trim()) {
    const norm = (s) => s.split('\n').map(l => l.trim()).filter(l => l).join('\n');
    const a = norm(typed), b = norm(code);
    if (a === b) {
      diffSummary = `<div class="typing-diff-summary match">✓ Your code matches the reference (whitespace-normalized).</div>`;
    } else {
      const aLines = a.split('\n'), bLines = b.split('\n');
      const matched = aLines.filter(l => bLines.includes(l)).length;
      const pct = Math.round(matched / Math.max(bLines.length, 1) * 100);
      diffSummary = `<div class="typing-diff-summary partial">≈ ${matched}/${bLines.length} lines match the reference (${pct}%) — minor differences are fine if your logic is right.</div>`;
    }
  }
  const escape = (s) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  return `<div class="typing-section" id="ts-${topicId}-${exIdx}">
    <h5>⌨️ Type it yourself</h5>
    <div class="typing-prompt">Implement this from scratch in the box below. Don't peek at the reference until you've tried.</div>
    <textarea class="typing-textarea" placeholder="def my_solution(...):\n    ..." oninput="updateTyping('${topicId}', ${exIdx}, this.value)">${escape(typed)}</textarea>
    ${diffSummary}
    <div class="typing-actions">
      <button class="btn btn-ghost" onclick="toggleTypingReference('${topicId}', ${exIdx})">${refShown ? '🙈 Hide reference' : '👁 Show reference'}</button>
      <button class="btn btn-ghost" onclick="clearTyping('${topicId}', ${exIdx})">↺ Clear</button>
    </div>
    ${refShown ? `<div class="typing-reference-block">
      <div class="ref-label">Reference solution</div>
      <pre>${escape(code)}</pre>
    </div>` : ''}
  </div>`;
}

function toggleLineWalk(topicId, exIdx) {
  const key = `${topicId}-${exIdx}`;
  lineWalkOpen[key] = !lineWalkOpen[key];
  rerenderExampleExtras(topicId, exIdx);
}

function toggleTypingPractice(topicId, exIdx) {
  const key = `${topicId}-${exIdx}`;
  typingOpen[key] = !typingOpen[key];
  rerenderExampleExtras(topicId, exIdx);
}

function toggleTypingReference(topicId, exIdx) {
  const key = `${topicId}-${exIdx}`;
  typingRefShown[key] = !typingRefShown[key];
  rerenderExampleExtras(topicId, exIdx);
}

function updateTyping(topicId, exIdx, value) {
  typingInputs[`${topicId}-${exIdx}`] = value;
  // Re-render only the diff summary, preserving textarea focus
  const wrap = document.getElementById(`ts-${topicId}-${exIdx}`);
  if (!wrap) return;
  const summary = wrap.querySelector('.typing-diff-summary');
  const ex = (LEARNING_TOPICS.find(t => t.id === topicId) || {}).examples?.[exIdx];
  if (!ex) return;
  const norm = (s) => s.split('\n').map(l => l.trim()).filter(l => l).join('\n');
  const a = norm(value), b = norm(ex.code || '');
  let html = '';
  if (a.trim()) {
    if (a === b) {
      html = `<div class="typing-diff-summary match">✓ Your code matches the reference (whitespace-normalized).</div>`;
    } else {
      const aLines = a.split('\n'), bLines = b.split('\n');
      const matched = aLines.filter(l => bLines.includes(l)).length;
      const pct = Math.round(matched / Math.max(bLines.length, 1) * 100);
      html = `<div class="typing-diff-summary partial">≈ ${matched}/${bLines.length} lines match the reference (${pct}%) — minor differences are fine if your logic is right.</div>`;
    }
  }
  if (summary) summary.outerHTML = html;
  else if (html) wrap.querySelector('.typing-textarea').insertAdjacentHTML('afterend', html);
}

function clearTyping(topicId, exIdx) {
  typingInputs[`${topicId}-${exIdx}`] = '';
  rerenderExampleExtras(topicId, exIdx);
}

function rerenderExampleExtras(topicId, exIdx) {
  // Find the example card and re-render its action area + extras
  const ex = (LEARNING_TOPICS.find(t => t.id === topicId) || {}).examples?.[exIdx];
  if (!ex) return;
  const container = document.getElementById(`ex-extras-${topicId}-${exIdx}`);
  if (container) container.outerHTML = exampleExtrasHtml(topicId, exIdx, ex);
}

function exampleExtrasHtml(topicId, exIdx, ex) {
  const key = `${topicId}-${exIdx}`;
  const hasAnnotations = !!EXAMPLE_ANNOTATIONS[key];
  const hasCode = !!ex.code;
  const lwOpen = lineWalkOpen[key];
  const tyOpen = typingOpen[key];
  const buttons = [];
  if (hasCode && hasAnnotations) {
    buttons.push(`<button class="btn-line-walk ${lwOpen?'on':''}" onclick="toggleLineWalk('${topicId}', ${exIdx})">${lwOpen ? '✓ Line walk' : '💡 Explain each line'}</button>`);
  }
  if (hasCode) {
    buttons.push(`<button class="btn-type-it ${tyOpen?'on':''}" onclick="toggleTypingPractice('${topicId}', ${exIdx})">${tyOpen ? '✓ Typing' : '⌨️ Type it yourself'}</button>`);
  }
  return `<div id="ex-extras-${topicId}-${exIdx}">
    ${buttons.length ? `<div class="example-actions">${buttons.join('')}</div>` : ''}
    ${lwOpen && hasAnnotations ? lineAnnotationsHtml(topicId, exIdx, ex.code) : ''}
    ${tyOpen && hasCode ? typingSectionHtml(topicId, exIdx, ex.code) : ''}
  </div>`;
}

const comprehensionSelected = {}; // 'topicId-exIdx-level' → index into question pool

function pickComprehensionQ(topicId, exIdx, level) {
  const entry = (COMPREHENSION[topicId] || [])[exIdx];
  if (!entry || !entry[level]) return null;
  const pool = Array.isArray(entry[level]) ? entry[level] : [entry[level]];
  const key = `${topicId}-${exIdx}-${level}`;
  if (comprehensionSelected[key] === undefined || comprehensionSelected[key] >= pool.length) {
    comprehensionSelected[key] = Math.floor(Math.random() * pool.length);
  }
  return pool[comprehensionSelected[key]];
}

function rotateComprehensionQ(topicId, exIdx, level) {
  const entry = (COMPREHENSION[topicId] || [])[exIdx];
  if (!entry || !entry[level]) return;
  const pool = Array.isArray(entry[level]) ? entry[level] : [entry[level]];
  if (pool.length < 2) return;
  const key = `${topicId}-${exIdx}-${level}`;
  const cur = comprehensionSelected[key] ?? 0;
  let next = cur;
  while (next === cur) next = Math.floor(Math.random() * pool.length);
  comprehensionSelected[key] = next;
  delete comprehensionAnswers[key];
  const card = document.getElementById(`ck-${topicId}-${exIdx}-${level}`);
  if (card) card.outerHTML = singleComprehensionHtml(topicId, exIdx, level);
}

function singleComprehensionHtml(topicId, exIdx, level) {
  const c = pickComprehensionQ(topicId, exIdx, level);
  if (!c) return '';
  const entry = (COMPREHENSION[topicId] || [])[exIdx];
  const pool = entry && Array.isArray(entry[level]) ? entry[level] : [entry && entry[level]].filter(Boolean);
  const hasMultiple = pool.length > 1;
  const key = `${topicId}-${exIdx}-${level}`;
  const state = comprehensionAnswers[key];
  const buttons = c.options.map((opt, i) => {
    let cls = 'btn-ck';
    if (state) {
      if (i === c.answerIdx) cls += ' correct';
      else if (i === state.picked) cls += ' wrong';
    }
    return `<button class="${cls}" ${state?'disabled':''} onclick="pickComprehension('${topicId}', ${exIdx}, '${level}', ${i})">${opt}</button>`;
  }).join('');
  let feedback = '';
  if (state) {
    feedback = `<div class="ck-feedback ${state.correct?'right':'wrong'}">
      ${state.correct ? '✓ Got it.' : `✗ The answer is: <b>${c.options[c.answerIdx]}</b>`}<br>${c.explanation}
    </div>`;
  }
  const rotateBtn = hasMultiple ? `<button class="btn-rotate-q" onclick="rotateComprehensionQ('${topicId}', ${exIdx}, '${level}')">↻ Try a different question</button>` : '';
  const labelText = level === 'easy' ? 'Quick Check · Easy' : 'Push Yourself · Hard';
  const poolBadge = hasMultiple ? ` <span style="font-size:9px;color:var(--muted);font-weight:400">· 1 of ${pool.length}</span>` : '';
  return `<div class="comprehension-card ${level==='hard'?'hard':''}" id="ck-${topicId}-${exIdx}-${level}">
    <div class="ck-label"><span class="level-pill ${level==='easy'?'easy':'hard'}">${level}</span> ${labelText}${poolBadge}</div>
    <div class="ck-q">${c.q}</div>
    <div class="ck-options">${buttons}</div>
    ${feedback}
    ${rotateBtn}
  </div>`;
}

function comprehensionHtml(topicId, exIdx) {
  const entry = (COMPREHENSION[topicId] || [])[exIdx];
  if (!entry) return '';
  return singleComprehensionHtml(topicId, exIdx, 'easy') + singleComprehensionHtml(topicId, exIdx, 'hard');
}

function pickComprehension(topicId, exIdx, level, optIdx) {
  const c = pickComprehensionQ(topicId, exIdx, level);
  if (!c) return;
  const key = `${topicId}-${exIdx}-${level}`;
  if (comprehensionAnswers[key]) return;
  comprehensionAnswers[key] = { picked: optIdx, correct: optIdx === c.answerIdx };
  const card = document.getElementById(`ck-${topicId}-${exIdx}-${level}`);
  if (card) card.outerHTML = singleComprehensionHtml(topicId, exIdx, level);
}

function goToProblemFromTopic(id) {
  switchMode('problems');
  setTimeout(() => selectProblem(id), 0);
}

function renderTopicDetail(id) {
  const t = LEARNING_TOPICS.find(x => x.id === id);
  if (!t) { backToMap(); return; }
  const state = learningState[id] || {};
  const cls = t.section.toLowerCase().replace(' ', '-');
  const diagramSvg = (SVGS[t.diagram] || (() => '<div style="color:var(--muted);font-size:13px">Diagram coming soon</div>'))();
  const videoBlock = t.videoId
    ? `<div class="video-wrap"><iframe src="https://www.youtube.com/embed/${t.videoId}?rel=0" allowfullscreen loading="lazy"></iframe></div>`
    : `<div class="video-fallback">
        <div class="ico">🎥</div>
        <p>Search YouTube for a high-quality intro to this topic.</p>
        <a class="btn btn-yt" href="https://www.youtube.com/results?search_query=${encodeURIComponent(t.videoSearch || t.title)}" target="_blank" rel="noopener">▶ Watch on YouTube</a>
      </div>`;
  const watched = state.videoWatched;
  const complete = state.complete;
  const takeaways = (t.takeaways || []).map(t => `<div class="takeaway-row"><span class="check">✓</span><span>${t}</span></div>`).join('');
  document.getElementById('appMain').innerHTML = `
    <div class="topic-detail">
      <button class="back-btn" onclick="backToMap()">← Back to topics</button>
      <div class="diagram-frame">${diagramSvg}</div>
      <div class="topic-title-row">
        <h2>${t.title}</h2>
        <span class="topic-est">⏱ ${t.estMin} min</span>
      </div>
      <span class="topic-section-badge ${cls}">${t.section}</span>${t.capstone ? ' <span class="tag-capstone">CAPSTONE</span>' : t.advanced ? ' <span class="tag-advanced">ADVANCED</span>' : t.optional ? ' <span class="tag-optional">OPTIONAL</span>' : ''}
      <div style="margin: 14px 0">
        <button class="lazy-toggle ${lazyModeOn ? 'on' : ''}" onclick="toggleLazyMode()" title="Switch between technical and plain-English explanations">
          ${lazyModeOn ? '😎 Lazy Mode' : '📚 Standard'}
        </button>
        ${lazyModeOn && (!t.lazyDetails || !t.lazyDetails.length) ? '<span class="lazy-coming-soon" style="margin-left:10px">No simple version yet — showing the standard one.</span>' : ''}
      </div>
      <p style="color:var(--muted);font-size:14px;line-height:1.55;margin-bottom:22px">${t.summary}</p>
      ${t.capstone ? capstoneGateHtml() : ''}
      ${progressBarHtml(topicProgress(t))}
      ${(() => {
        const useLazy = lazyModeOn && t.lazyDetails && t.lazyDetails.length;
        const blocks = useLazy ? t.lazyDetails : (t.details || []);
        if (blocks.length) {
          return `<div class="details-section">
            ${blocks.map(d => `<div class="detail-block"><h4>${d.heading}</h4>${d.body}</div>`).join('')}
          </div>`;
        }
        return t.explanation ? `<div class="explanation-section"><h3>Understanding ${t.title}</h3>${t.explanation}</div>` : '';
      })()}
      ${t.examples && t.examples.length ? examplesHtml(t.examples, t.id) : ''}
      ${t.gotchas && t.gotchas.length ? `<div class="gotchas-section">
        <h3>⚠️ Watch out for</h3>
        ${t.gotchas.map(g => `<div class="gotcha-row"><span class="marker">!</span><span>${g}</span></div>`).join('')}
      </div>` : ''}
      ${takeaways ? `<div class="takeaways-section"><h3>Quick Recap</h3>${takeaways}</div>` : ''}
      ${t.code ? `<div class="code-example">
        <div class="lang-badge">${t.code.lang || 'Code'}</div>
        <pre>${t.code.snippet.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</pre>
        ${t.code.explain ? `<div class="code-explain">${t.code.explain}</div>` : ''}
      </div>` : ''}
      <div class="reference-label">📺 Reference video (supplemental)</div>
      ${videoBlock}
      <div class="video-actions">
        <button class="btn btn-ghost btn-watched-toggle ${watched ? 'on' : ''}" onclick="markVideoWatched('${t.id}', ${!watched})">
          ${watched ? '👁 Watched' : '👁 Mark video watched'}
        </button>
      </div>
      <div class="action-row-learn">
        <button class="btn btn-practice" onclick='goToPractice(${JSON.stringify(t.practice).replace(/'/g, "&#39;")})'>${t.practice.label || 'Practice this'} →</button>
        <button class="btn btn-mark-complete ${complete ? 'on' : ''}" onclick="markTopicComplete('${t.id}', ${!complete})">
          ${complete ? '✓ Understood' : '✓ Mark Understood'}
        </button>
      </div>
    </div>`;
}

function markVideoWatched(id, value) {
  learningState[id] = learningState[id] || {};
  learningState[id].videoWatched = value;
  api('/api/learning', { topicId: id, field: 'videoWatched', value });
  renderTopicDetail(id);
}

function markTopicComplete(id, value) {
  learningState[id] = learningState[id] || {};
  learningState[id].complete = value;
  api('/api/learning', { topicId: id, field: 'complete', value });
  renderTopicDetail(id);
}

function goToPractice(practice) {
  if (!practice) return;
  if (practice.type === 'bigo') {
    switchMode('bigo');
    startBigoSession();
  } else if (practice.type === 'sorting') {
    if (practice.algoId) selectedAlgoId = practice.algoId;
    switchMode('sorting');
  } else if (practice.type === 'problems') {
    switchMode('problems');
    if (practice.filter) {
      // After mode switch the DOM has fresh filter selects; populate them
      setTimeout(() => {
        if (practice.filter.ds) {
          // Find a category that contains this DS by cross-referencing PROBLEMS
          const matching = problems.filter(p => p.ds === practice.filter.ds);
          if (matching.length) {
            // Use search to filter by ds — we set search to ds keyword
            const search = document.getElementById('search');
            if (search) { search.value = practice.filter.ds; renderList(); }
          }
        }
        if (practice.filter.category) {
          const cat = document.getElementById('fCat');
          if (cat) { cat.value = practice.filter.category; renderList(); }
        }
      }, 0);
    }
  }
}

