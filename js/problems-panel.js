// ── Actions ────────────────────────────────────────────────────────────────
function selectProblem(id) { selId = id; resetTimer(); renderPanel(); renderList(); }

function toggleDone(id) {
  const val = !done.has(id);
  val ? done.add(id) : done.delete(id);
  updateProgress(); renderList(); renderPanel();
  api('/api/set-done', { id, value: val });
}

function toggleReview(id) {
  const val = !review.has(id);
  val ? review.add(id) : review.delete(id);
  renderList(); renderPanel();
  api('/api/set-review', { id, value: val });
}

function markOutcome(id, outcome) {
  const elapsed = secs < 1200 ? 1200 - secs : 0;
  const attempt = { ts: Date.now(), elapsed, outcome };
  problemData[id] = problemData[id] || {};
  problemData[id].attempts = [...(problemData[id].attempts || []), attempt];
  done.add(id);
  if (outcome !== 'solved' && !review.has(id)) review.add(id);
  updateProgress(); renderList(); renderPanel();
  api('/api/log-attempt', { id, elapsed, outcome });
  api('/api/set-done', { id, value: true });
  if (outcome !== 'solved') api('/api/set-review', { id, value: true });
}

function tryAgain(id) {
  done.delete(id);
  updateProgress(); renderList(); renderPanel();
  resetTimer();
  api('/api/set-done', { id, value: false });
}

function saveNote(id, text) {
  problemData[id] = problemData[id] || {};
  problemData[id].notes = text;
  clearTimeout(noteDebounce[id]);
  noteDebounce[id] = setTimeout(() => api('/api/save-note', { id, text }), 600);
}

function randomProblem() {
  const list = filtered();
  if (!list.length) return;
  selectProblem(list[Math.floor(Math.random() * list.length)].id);
}

// ── Attempts display ───────────────────────────────────────────────────────
function outcomeTag(o) {
  if (o === 'solved') return `<span style="color:var(--easy)">Solved</span>`;
  if (o === 'hint') return `<span style="color:var(--medium)">Needed Hint</span>`;
  if (o === 'watched') return `<span style="color:var(--hard)">Watched</span>`;
  return '';
}

function attemptsHtml(id) {
  const a = getAttempts(id);
  if (!a.length) return '';
  const solvedTimes = a.filter(x => x.outcome === 'solved').map(x => x.elapsed);
  const best = solvedTimes.length ? Math.min(...solvedTimes) : null;
  const rows = a.slice(-3).reverse().map((x, i) =>
    `<div class="attempt-item">
      <span>Attempt ${a.length - i} · ${outcomeTag(x.outcome)}</span>
      <span>${fmt(x.elapsed)} · ${new Date(x.ts).toLocaleDateString()}</span>
    </div>`
  ).join('');
  const bestStr = best !== null ? ` · Best: <span style="color:var(--easy)">${fmt(best)}</span>` : '';
  return `<div class="attempts-section">
    <div class="attempts-label">${a.length} attempt${a.length > 1 ? 's' : ''}${bestStr}</div>
    <div class="attempt-list">${rows}</div>
  </div>`;
}

// ── Render list ────────────────────────────────────────────────────────────
function isDueForSpacedReview(problemId) {
  const data = problemData[problemId] || {};
  const attempts = data.attempts || [];
  if (!attempts.length) return false;
  const lastSolved = [...attempts].reverse().find(a => a.outcome === 'solved');
  if (!lastSolved) return false;
  const days = (Date.now() - lastSolved.ts) / 86400000;
  return days >= 14;
}

function filtered() {
  const q = document.getElementById('search').value.toLowerCase();
  const d = document.getElementById('fDiff').value;
  const c = document.getElementById('fCat').value;
  const s = document.getElementById('fStatus').value;
  return problems.filter(p =>
    (d === 'All' || p.difficulty === d) &&
    (c === 'All' || p.category === c) &&
    (!q || p.name.toLowerCase().includes(q) || (p.ds && p.ds.toLowerCase().includes(q))) &&
    (s === 'All' || (s === 'Done' && done.has(p.id)) || (s === 'Not Done' && !done.has(p.id)) || (s === 'Review' && review.has(p.id)) || (s === 'Spaced Review' && isDueForSpacedReview(p.id)))
  );
}

function catMastered(items) {
  return items.filter(p => done.has(p.id)).length / items.length >= 0.8;
}

function renderCatHeader(list, cat, items) {
  const doneCount = items.filter(p => done.has(p.id)).length;
  const pct = Math.round((doneCount / items.length) * 100);
  const mastered = pct >= 80;
  const h = document.createElement('li');
  h.className = 'cat-header' + (mastered ? ' mastered' : '');
  h.innerHTML = `
    <span class="cat-name">${mastered ? '✓ ' : ''}${cat}</span>
    <span class="cat-pct">${doneCount}/${items.length}</span>
    <span class="cat-bar"><span class="cat-bar-fill" style="width:${pct}%"></span></span>`;
  list.appendChild(h);
}

function renderProblemItem(list, p) {
  const li = document.createElement('li');
  li.className = 'problem-item' + (p.id === selId ? ' active' : '') + (done.has(p.id) ? ' done' : '');
  li.innerHTML = `
    <div class="chk ${done.has(p.id) ? 'on' : ''}" onclick="event.stopPropagation();toggleDone(${p.id})">${done.has(p.id) ? '✓' : ''}</div>
    <div class="p-info">
      <div class="p-name">${p.name}${p.premium ? ' 🔒' : ''}</div>
      <div class="p-sub">${p.ds}</div>
    </div>
    ${review.has(p.id) ? '<div class="review-dot" title="Marked for review"></div>' : ''}
    ${isDueForSpacedReview(p.id) ? '<div class="spaced-dot" title="Due for spaced review (solved 14+ days ago)"></div>' : ''}
    <div class="dot ${p.difficulty}"></div>`;
  li.addEventListener('click', () => selectProblem(p.id));
  list.appendChild(li);
}

function renderList() {
  const list = document.getElementById('pList');
  list.innerHTML = '';
  const grouped = {};
  filtered().forEach(p => { (grouped[p.category] = grouped[p.category] || []).push(p); });

  const inProgress = [], mastered = [];
  Object.entries(grouped).forEach(([cat, items]) => {
    (catMastered(items) ? mastered : inProgress).push([cat, items]);
  });

  inProgress.forEach(([cat, items]) => {
    renderCatHeader(list, cat, items);
    items.forEach(p => renderProblemItem(list, p));
  });

  if (mastered.length) {
    const div = document.createElement('li');
    div.className = 'cat-divider';
    div.textContent = `✓ Mastered (${mastered.length})`;
    list.appendChild(div);
    mastered.forEach(([cat, items]) => {
      renderCatHeader(list, cat, items);
      items.forEach(p => renderProblemItem(list, p));
    });
  }

  updateProgress();
}

// ── Render panel ───────────────────────────────────────────────────────────
function renderPanel() {
  const panel = document.getElementById('panel');
  if (!selId) {
    panel.innerHTML = '<div class="empty"><div class="ico">🎯</div><p>Select a problem to begin</p></div>';
    return;
  }
  const p = problems.find(x => x.id === selId);
  if (!p) return;
  const isDone = done.has(p.id);

  const actionSection = isDone
    ? `<div class="done-state">
        <div class="done-badge">✓ Completed</div>
        <button class="btn btn-ghost" onclick="tryAgain(${p.id})">↩ Try Again</button>
      </div>`
    : `<div class="outcome-section">
        <div class="outcome-label">How did it go?</div>
        <div class="outcome-row">
          <button class="btn-outcome solved" onclick="markOutcome(${p.id},'solved')">✓ Solved</button>
          <button class="btn-outcome hint" onclick="markOutcome(${p.id},'hint')">💡 Needed Hint</button>
          <button class="btn-outcome watched" onclick="markOutcome(${p.id},'watched')">👁 Watched</button>
        </div>
      </div>`;

  panel.innerHTML = `
    <div class="panel-content">
      <div class="panel-header">
        <h2>${p.name}${p.premium ? ` <span style="font-size:13px;color:var(--medium)">🔒 Premium</span>` : ''}</h2>
        <div class="badges">
          <span class="badge ${p.difficulty}">${p.difficulty}</span>
          <span class="badge ds">${p.ds}</span>
          <span class="badge cat">${p.category}</span>
        </div>
      </div>
      <div class="timer-box">
        <div class="timer-num" id="tNum">${fmt(secs)}</div>
        <div class="timer-btns">
          <button class="btn btn-primary" id="startBtn" onclick="startTimer()">▶ Start</button>
          <button class="btn btn-ghost" onclick="resetTimer()">↺ Reset</button>
        </div>
      </div>
      <div class="action-row">
        <a class="btn btn-yt" href="${ytUrl(p)}" target="_blank" rel="noopener">▶ Watch on YouTube</a>
        <a class="btn btn-lc" href="${lcUrl(p.slug)}" target="_blank" rel="noopener" onclick="if(!running)startTimer()">→ LeetCode</a>
      </div>
      ${actionSection}
      <button class="btn btn-review ${review.has(p.id) ? 'on' : ''}" onclick="toggleReview(${p.id})">
        ${review.has(p.id) ? '🔁 Needs Review' : '🔁 Mark for Review'}
      </button>
      ${attemptsHtml(p.id)}
      ${solutionHtml(p.id)}
      <div class="notes-section">
        <label>Notes</label>
        <textarea class="notes-textarea" oninput="saveNote(${p.id}, this.value)" placeholder="Approach, complexity, gotchas…">${getNote(p.id)}</textarea>
      </div>
    </div>`;
}

function solutionHtml(id) {
  const sol = SOLUTIONS[id];
  if (!sol) return '';
  const data = problemData[id] || {};
  const shown = data.solutionShown;
  if (!shown) {
    return `<div class="solution-section">
      <button class="btn btn-show-solution" onclick="toggleSolution(${id})">💡 Show Optimal Approach</button>
    </div>`;
  }
  return `<div class="solution-section">
    <button class="btn btn-show-solution" onclick="toggleSolution(${id})">▼ Hide Solution</button>
    <div class="solution-box">
      <h4>Approach</h4>
      <p>${sol.approach}</p>
      <div class="solution-complexity">
        <span class="badge time">Time: ${sol.time}</span>
        <span class="badge space">Space: ${sol.space}</span>
      </div>
      ${sol.insight ? `<div class="solution-insight">${sol.insight}</div>` : ''}
    </div>
  </div>`;
}

function toggleSolution(id) {
  problemData[id] = problemData[id] || {};
  problemData[id].solutionShown = !problemData[id].solutionShown;
  // Persist a "viewed once" flag on first reveal
  if (problemData[id].solutionShown && !problemData[id].solutionViewed) {
    problemData[id].solutionViewed = true;
    api('/api/save-note', { id, text: getNote(id) }); // touch the doc to ensure problemData[id] gets created on server
  }
  renderPanel();
}

// ── Export / Import ────────────────────────────────────────────────────────
function exportData() { window.location.href = '/api/export'; }
function importData() { document.getElementById('importFile').click(); }
async function handleImport(input) {
  const file = input.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    await fetch('/api/import', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    location.reload();
  } catch (e) { alert('Import failed: ' + e.message); }
}

// ── Config / Sheets ────────────────────────────────────────────────────────
function openCfg() {
  document.getElementById('sheetId').value = localStorage.getItem('b75_sheet') || '';
  document.getElementById('cfgModal').classList.add('open');
}
function closeCfg() { document.getElementById('cfgModal').classList.remove('open'); }
function saveCfg() {
  const v = document.getElementById('sheetId').value.trim();
  v ? localStorage.setItem('b75_sheet', v) : localStorage.removeItem('b75_sheet');
  closeCfg(); init();
}

document.getElementById('cfgModal').addEventListener('click', e => { if (e.target === e.currentTarget) closeCfg(); });

async function loadSheets(id) {
  const url = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:json`;
  const text = await (await fetch(url)).text();
  const m = text.match(/setResponse\(([\s\S]*)\);?\s*$/);
  if (!m) throw new Error('parse');
  const { table } = JSON.parse(m[1]);
  const cols = table.cols.map(c => c.label.toLowerCase().trim());
  const col = l => cols.indexOf(l);
  return table.rows.map((row, i) => {
    const v = idx => (idx >= 0 && row.c[idx]) ? String(row.c[idx].v) : '';
    const lcRaw = v(col('leetcode url'));
    const slug = lcRaw.replace(/https?:\/\/leetcode\.com\/problems\//, '').replace(/\/$/, '') || `problem-${i + 1}`;
    return {
      id: i + 1,
      name: v(col('name')) || v(col('problem name')) || `Problem ${i + 1}`,
      slug, difficulty: v(col('difficulty')) || 'Medium',
      category: v(col('category')) || 'Uncategorized',
      ds: v(col('data structure')) || v(col('core data structure')) || '',
      youtubeUrl: v(col('youtube url')) || v(col('youtube')) || '',
      premium: /true/i.test(v(col('premium'))),
    };
  }).filter(p => p.name && !p.name.startsWith('Problem ') || p.slug !== `problem-${i + 1}`);
}
function renderProblemsMode() {
  document.getElementById('appMain').innerHTML = `
    <aside class="sidebar">
      <div class="filters">
        <input id="search" type="text" placeholder="Search…" oninput="renderList()">
        <div class="filter-row">
          <select id="fDiff" onchange="renderList()">
            <option value="All">All Levels</option>
            <option>Easy</option><option>Medium</option><option>Hard</option>
          </select>
          <select id="fCat" onchange="renderList()">
            <option value="All">All Categories</option>
          </select>
        </div>
        <div class="filter-row">
          <select id="fStatus" onchange="renderList()">
            <option value="All">All Status</option>
            <option value="Not Done">Not Done</option>
            <option value="Done">Done</option>
            <option value="Review">Needs Review</option>
          </select>
          <button class="btn btn-ghost btn-random" onclick="randomProblem()">🎲 Random</button>
        </div>
      </div>
      <ul class="problem-list" id="pList"></ul>
    </aside>
    <section class="panel" id="panel">
      <div class="empty"><div class="ico">🎯</div><p>Select a problem to begin</p></div>
    </section>`;
  const cats = [...new Set(problems.map(p => p.category))];
  document.getElementById('fCat').innerHTML =
    '<option value="All">All Categories</option>' + cats.map(c => `<option>${c}</option>`).join('');
  renderList(); renderPanel();
}

