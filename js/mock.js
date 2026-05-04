function renderMockMode() {
  document.getElementById('appMain').innerHTML = `
    <aside class="sidebar" id="mockSidebar"></aside>
    <section class="panel quiz-wrap" id="mockPanel"></section>`;
  renderMockSidebar();
  renderMockContent();
}

function renderMockSidebar() {
  const sb = document.getElementById('mockSidebar');
  if (!sb) return;
  const total = mockHistory.length;
  const cleanSolves = mockHistory.filter(h => h.outcome === 'solved-clean').length;
  const rate = total ? Math.round(cleanSolves / total * 100) : 0;
  const recent = mockHistory.slice(-8).reverse();
  const rows = recent.map(h => {
    const p = problems.find(x => x.id === h.problemId);
    const date = new Date(h.ts).toLocaleDateString();
    const outcomeCls = h.outcome === 'solved-clean' ? 'high' : h.outcome === 'solved-hint' ? 'mid' : 'low';
    return `<div class="stat-row"><span title="${p ? p.name : '?'}">${(p ? p.name : '?').slice(0, 20)}</span><span class="acc ${outcomeCls}">${date}</span></div>`;
  }).join('');
  sb.innerHTML = `
    <div class="stats-section">
      <h3>Mock Interview Stats</h3>
      <div class="stats-grid">
        <div class="stat-cell"><div class="num">${total}</div><div class="lbl">Total</div></div>
        <div class="stat-cell"><div class="num">${cleanSolves}</div><div class="lbl">Clean</div></div>
        <div class="stat-cell"><div class="num">${rate}%</div><div class="lbl">Solve Rate</div></div>
      </div>
    </div>
    <div class="stats-section">
      <h3>Recent Sessions</h3>
    </div>
    <div class="stats-list">${rows || '<div style="padding:14px;font-size:11px;color:var(--muted);text-align:center">No mock interviews yet — start one!</div>'}</div>`;
}

function renderMockContent() {
  const panel = document.getElementById('mockPanel');
  if (!panel) return;
  if (mockState === 'idle') {
    panel.innerHTML = `
      <div class="quiz-card" style="text-align:center">
        <div style="font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;font-weight:700;margin-bottom:18px">Mock Interview Mode</div>
        <div style="font-size:16px;color:var(--text);margin-bottom:22px;line-height:1.6">
          A random unsolved problem<br>
          45-minute timer<br>
          No solution reveal — just like a real interview<br>
          Self-grade rubric after
        </div>
        <button class="btn btn-primary" style="padding:14px 28px;font-size:14px" onclick="startMock()">▶ Start Mock Interview</button>
      </div>`;
  } else if (mockState === 'active') {
    const p = mockProblem;
    const mins = Math.floor(mockSecsRemaining / 60);
    const secs = mockSecsRemaining % 60;
    const danger = mockSecsRemaining <= 60 ? ' danger' : mockSecsRemaining <= 300 ? ' warn' : '';
    panel.innerHTML = `
      <div class="quiz-card">
        <div class="timer-num${danger}" style="text-align:center;margin-bottom:16px">${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}</div>
        <h2 style="font-size:22px;margin-bottom:9px">${p.name} <span class="badge ${p.difficulty}">${p.difficulty}</span></h2>
        <div style="margin-bottom:16px;color:var(--muted);font-size:13px">
          <span class="badge cat">${p.category}</span> ·
          <span class="badge ds">${p.ds}</span>
        </div>
        <div class="example-problem" style="font-size:14px;line-height:1.6;margin-bottom:20px">
          <strong>Talk through your approach OUT LOUD before coding.</strong> State complexity. Walk an example. Then implement on LeetCode.
        </div>
        <div class="action-row">
          <a class="btn btn-lc" href="${lcUrl(p.slug)}" target="_blank" rel="noopener" style="flex:1;justify-content:center">→ Open on LeetCode</a>
        </div>
        <div class="action-row">
          <button class="btn btn-outcome solved" onclick="endMock('solved-clean')">✓ Solved Cleanly</button>
          <button class="btn btn-outcome hint" onclick="endMock('solved-hint')">💡 Solved After Hint</button>
          <button class="btn btn-outcome watched" onclick="endMock('stuck')">✗ Stuck</button>
        </div>
      </div>`;
  } else if (mockState === 'grading') {
    const p = mockProblem;
    const checkboxes = MOCK_RUBRIC.map((r, i) => `
      <div style="display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-bottom:1px dashed var(--border)">
        <input type="checkbox" ${mockRubricAnswers[i] ? 'checked' : ''} onchange="mockRubricAnswers[${i}] = this.checked" style="margin-top:3px;cursor:pointer"/>
        <span style="font-size:13px;line-height:1.5">${r}</span>
      </div>
    `).join('');
    panel.innerHTML = `
      <div class="quiz-card">
        <div style="font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;font-weight:700;margin-bottom:14px">Self-Grade Rubric — ${p.name}</div>
        <div style="margin-bottom:16px;font-size:13px;color:var(--text);line-height:1.6">Be honest. These are the meta-skills interviewers actually grade you on.</div>
        ${checkboxes}
        <div class="quiz-actions" style="margin-top:18px">
          <button class="btn btn-primary" onclick="finishMock()">Save Session →</button>
        </div>
      </div>`;
  }
}

function startMock() {
  // Pick a random problem the user hasn't solved yet (or any if all solved)
  const unsolved = problems.filter(p => !done.has(p.id) && !p.premium);
  const pool = unsolved.length ? unsolved : problems.filter(p => !p.premium);
  mockProblem = pool[Math.floor(Math.random() * pool.length)];
  mockStart = Date.now();
  mockSecsRemaining = MOCK_DURATION;
  mockState = 'active';
  renderMockContent();
  if (mockTickInterval) clearInterval(mockTickInterval);
  mockTickInterval = setInterval(() => {
    mockSecsRemaining--;
    if (mockSecsRemaining <= 0) {
      clearInterval(mockTickInterval);
      mockSecsRemaining = 0;
      endMock('stuck');
    } else {
      renderMockContent();
    }
  }, 1000);
}

function endMock(outcome) {
  if (mockTickInterval) clearInterval(mockTickInterval);
  mockTickInterval = null;
  mockState = 'grading';
  mockRubricAnswers = MOCK_RUBRIC.map(() => false);
  mockProblem._endOutcome = outcome;
  renderMockContent();
}

function finishMock() {
  const durationSec = Math.round((Date.now() - mockStart) / 1000);
  const outcome = mockProblem._endOutcome;
  const session = { ts: Date.now(), problemId: mockProblem.id, durationSec, outcome, rubric: mockRubricAnswers };
  mockHistory.push(session);
  api('/api/log-mock', { problemId: mockProblem.id, durationSec, outcome, rubric: mockRubricAnswers });
  mockState = 'idle';
  mockProblem = null;
  renderMockSidebar();
  renderMockContent();
}

