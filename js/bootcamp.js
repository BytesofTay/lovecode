// ── Bootcamp mode: 7-Day Start Here Path ──────────────────────────────────
// State persists to localStorage. Each day has a 3-task checklist
// (🧠 Teach · 🌱 Warmup Easy · 🌊 Plunge Medium); complete all three
// to mark the day done and unlock the next.

const BOOTCAMP_STATE_KEY = 'lovecode_bootcamp';
let bootcampData = {
  startedAt: null,           // ms timestamp of "Start the Path" click
  completedDays: {},         // { 1: timestamp, 2: timestamp, ... }
  taskDone: {},              // { '1-teach': true, '1-warmup': true, '1-plunge': true }
  view: 'map',               // 'map' | 'day'
  activeDay: null,           // current day being viewed in 'day' view
};
try {
  const saved = JSON.parse(localStorage.getItem(BOOTCAMP_STATE_KEY) || 'null');
  if (saved) bootcampData = Object.assign(bootcampData, saved);
} catch (_) {}

function saveBootcampState() {
  try {
    const { view, activeDay, ...persist } = bootcampData;
    localStorage.setItem(BOOTCAMP_STATE_KEY, JSON.stringify(persist));
  } catch (_) {}
}

function bootcampStreak() {
  let s = 0;
  for (let i = 1; i <= BOOTCAMP_DAYS.length; i++) {
    if (bootcampData.completedDays[i]) s++;
    else break;
  }
  return s;
}

function bootcampNextDay() {
  for (let i = 1; i <= BOOTCAMP_DAYS.length; i++) {
    if (!bootcampData.completedDays[i]) return i;
  }
  return BOOTCAMP_DAYS.length;
}

function isDayUnlocked(dayNum) {
  if (dayNum === 1) return true;
  return !!bootcampData.completedDays[dayNum - 1];
}

function isTaskDone(dayNum, taskKey) {
  return !!bootcampData.taskDone[`${dayNum}-${taskKey}`];
}

// Three-task day progress. The third (plunge) auto-marks done when the
// linked Medium problem gets marked solved — we detect that via the global
// `done` set. Manual toggling still works.
function dayProgress(dayNum) {
  const d = BOOTCAMP_DAYS.find(x => x.day === dayNum);
  const tasks = ['teach', 'warmup', 'plunge'];
  const auto = {
    warmup: d && done && done.has(d.warmupEasyId),
    plunge: d && done && done.has(d.plungeMediumId),
  };
  const doneCount = tasks.filter(t => isTaskDone(dayNum, t) || auto[t]).length;
  return { done: doneCount, total: tasks.length };
}

function startBootcamp() {
  if (!bootcampData.startedAt) {
    bootcampData.startedAt = Date.now();
    saveBootcampState();
  }
  bootcampData.view = 'map';
  bootcampData.activeDay = null;
  renderBootcampMode();
}

function resetBootcamp() {
  if (!confirm('Reset all path progress? Your completion data will be lost (other quiz/learning data is unaffected).')) return;
  bootcampData = {
    startedAt: null, completedDays: {}, taskDone: {}, view: 'map', activeDay: null,
  };
  saveBootcampState();
  renderBootcampMode();
}

function openBootcampDay(dayNum) {
  if (!isDayUnlocked(dayNum)) return;
  bootcampData.view = 'day';
  bootcampData.activeDay = dayNum;
  renderBootcampMode();
}

function closeBootcampDay() {
  bootcampData.view = 'map';
  bootcampData.activeDay = null;
  renderBootcampMode();
}

function toggleBootcampTask(dayNum, taskKey) {
  const k = `${dayNum}-${taskKey}`;
  if (bootcampData.taskDone[k]) delete bootcampData.taskDone[k];
  else bootcampData.taskDone[k] = true;
  saveBootcampState();
  renderBootcampMode();
}

function completeBootcampDay(dayNum) {
  const p = dayProgress(dayNum);
  if (p.done < p.total) {
    if (!confirm(`Only ${p.done} of ${p.total} tasks marked done. Mark this day complete anyway?`)) return;
  }
  bootcampData.completedDays[dayNum] = Date.now();
  saveBootcampState();
  bootcampData.view = 'map';
  bootcampData.activeDay = null;
  renderBootcampMode();
}

// ── Navigation helpers ─────────────────────────────────────────
function bootcampGoToTopic(topicId) {
  switchMode('learn');
  setTimeout(() => goToTopic(topicId), 0);
}

function bootcampGoToDrill(drillFocus) {
  const target = BOOTCAMP_DRILL_TARGETS[drillFocus];
  if (!target) return;
  switchMode(target.mode);
  setTimeout(() => {
    if (target.mode === 'drills' && typeof setDrillsSubMode === 'function') setDrillsSubMode(target.sub);
    else if (target.mode === 'build' && typeof setBuildSubMode === 'function') setBuildSubMode(target.sub);
    else if (target.mode === 'recall' && typeof setRecallSubMode === 'function') setRecallSubMode(target.sub);
  }, 0);
}

function bootcampGoToProblem(pid) {
  switchMode('problems');
  setTimeout(() => selectProblem(pid), 0);
}

function bootcampGoToMock() {
  switchMode('mock');
}

// ── Welcome modal (first-visit only) ──────────────────────────
function maybeShowWelcomeModal() {
  try {
    const seen = localStorage.getItem('lovecode_welcomed') === '1';
    const freshUser = (typeof done === 'undefined' || done.size === 0) &&
                      (typeof problemData === 'undefined' || Object.keys(problemData || {}).length === 0);
    if (seen || !freshUser) return;
    showWelcomeModal();
  } catch (_) {}
}

function showWelcomeModal() {
  if (document.getElementById('welcomeOverlay')) return;
  const overlay = document.createElement('div');
  overlay.id = 'welcomeOverlay';
  overlay.className = 'overlay open';
  overlay.innerHTML = `
    <div class="modal welcome-modal">
      <h3>🎓 Welcome — here's the path.</h3>
      <p><strong>7 days.</strong> Each day you'll <strong>learn one pattern</strong>, <strong>warm up on an Easy</strong>, and <strong>plunge into a real Medium</strong>. The Medium is the point — that's what interviews actually ask.</p>
      <p>When you get stuck (you will), the hint ladder, pseudocode, brute-force walkthrough, and in-browser test runner are one click away. They appear <em>when you need them</em>, not by default.</p>
      <p class="welcome-stats">⏱ ~2 hours/day · 7 days · 14 problems including 7 real Mediums</p>
      <div class="modal-foot">
        <button class="btn btn-ghost" onclick="dismissWelcomeModal(false)">I'll explore first</button>
        <button class="btn btn-primary" onclick="dismissWelcomeModal(true)">▶ Start Day 1: Hash Maps</button>
      </div>
    </div>`;
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) dismissWelcomeModal(false);
  });
  document.body.appendChild(overlay);
}

function dismissWelcomeModal(committed) {
  const el = document.getElementById('welcomeOverlay');
  if (el) el.remove();
  if (committed) {
    try { localStorage.setItem('lovecode_welcomed', '1'); } catch (_) {}
    startBootcamp();
    setTimeout(() => openBootcampDay(1), 0);
  }
  // If not committed, do NOT set the flag — modal will reappear next session
  // so the user gets another chance to commit.
}

// ── Rendering ──────────────────────────────────────────────────
function renderBootcampMode() {
  if (bootcampData.view === 'day' && bootcampData.activeDay) renderBootcampDay(bootcampData.activeDay);
  else renderBootcampMap();
}

function renderBootcampMap() {
  const total = BOOTCAMP_DAYS.length;
  const completed = Object.keys(bootcampData.completedDays).length;
  const streak = bootcampStreak();
  const next = bootcampNextDay();
  const pct = Math.round((completed / total) * 100);
  const started = !!bootcampData.startedAt;

  const dayCard = (d) => {
    const unlocked = isDayUnlocked(d.day);
    const isDone = !!bootcampData.completedDays[d.day];
    const isCurrent = !isDone && unlocked && d.day === next;
    const prog = dayProgress(d.day);
    let statusBadge = '';
    let cls = 'bc-day-card';
    if (isDone) { statusBadge = '<span class="bc-status done">✓ Complete</span>'; cls += ' done'; }
    else if (!unlocked) { statusBadge = '<span class="bc-status locked">🔒 Locked</span>'; cls += ' locked'; }
    else if (isCurrent) { statusBadge = '<span class="bc-status current">▶ Current</span>'; cls += ' current'; }
    else { statusBadge = `<span class="bc-status pending">${prog.done}/${prog.total} tasks</span>`; }
    const onclick = unlocked ? `onclick="openBootcampDay(${d.day})"` : '';

    // 3-task mini-list
    const easyP = (typeof problems !== 'undefined') ? problems.find(p => p.id === d.warmupEasyId) : null;
    const medP = (typeof problems !== 'undefined') ? problems.find(p => p.id === d.plungeMediumId) : null;
    const teachDone = isTaskDone(d.day, 'teach');
    const warmDone  = (typeof done !== 'undefined' && done.has(d.warmupEasyId)) || isTaskDone(d.day, 'warmup');
    const plungeDone = (typeof done !== 'undefined' && done.has(d.plungeMediumId)) || isTaskDone(d.day, 'plunge');
    const tasksMini = `
      <div class="bc-day-tasks">
        <div class="bc-mini ${teachDone ? 'done' : ''}"><span class="bc-mini-icon">🧠</span><span class="bc-mini-text">Teach</span><span class="bc-mini-check">${teachDone ? '✓' : ''}</span></div>
        <div class="bc-mini ${warmDone ? 'done' : ''}"><span class="bc-mini-icon">🌱</span><span class="bc-mini-text">${easyP ? easyP.name : 'Warmup'}</span><span class="bc-mini-check">${warmDone ? '✓' : ''}</span></div>
        <div class="bc-mini ${plungeDone ? 'done' : ''}"><span class="bc-mini-icon">🌊</span><span class="bc-mini-text">${medP ? medP.name : 'Plunge'}</span><span class="bc-mini-check">${plungeDone ? '✓' : ''}</span></div>
      </div>`;

    return `<div class="${cls}" ${onclick}>
      <div class="bc-day-num">DAY ${d.day}</div>
      <div class="bc-day-title">${d.title}</div>
      <div class="bc-day-meta">
        <span>⏱ ~${d.estMinutes} min</span>
        ${statusBadge}
      </div>
      ${tasksMini}
    </div>`;
  };

  const allDayCards = BOOTCAMP_DAYS.map(dayCard).join('');

  const heroBlock = started
    ? `<div class="bc-hero">
        <div class="bc-hero-left">
          <div class="bc-hero-title">🎓 7-Day Start Here Path</div>
          <div class="bc-hero-sub">Day ${next} is up. ${total - completed} day${total - completed === 1 ? '' : 's'} remaining.</div>
        </div>
        <div class="bc-hero-stats">
          <div class="bc-stat">
            <div class="bc-stat-num">${streak}🔥</div>
            <div class="bc-stat-lbl">streak</div>
          </div>
          <div class="bc-stat">
            <div class="bc-stat-num">${completed}/${total}</div>
            <div class="bc-stat-lbl">days done</div>
          </div>
          <div class="bc-stat">
            <div class="bc-stat-num">${pct}%</div>
            <div class="bc-stat-lbl">complete</div>
          </div>
        </div>
        <div class="bc-progress-bar"><div class="bc-progress-fill" style="width:${pct}%"></div></div>
        ${completed > 0 ? `<button class="btn btn-ghost bc-reset" onclick="resetBootcamp()">↺ Reset progress</button>` : ''}
      </div>`
    : `<div class="bc-hero bc-hero-start">
        <div class="bc-hero-title">🎓 7-Day Start Here Path</div>
        <p class="bc-hero-blurb">One week. Each day you <strong>learn one pattern</strong>, <strong>warm up on an Easy</strong>, then <strong>plunge into a real Medium</strong> — the kind interviews actually ask. ~2 hours/day.</p>
        <p class="bc-hero-blurb"><strong>The point:</strong> stop reading about patterns. Apply each one to a Medium the same day. The hint ladder, pseudocode, brute-force walkthrough, and in-browser runner are right there when you get stuck — but only when you ask.</p>
        <button class="btn btn-primary" onclick="startBootcamp()">▶ Start the Path</button>
      </div>`;

  document.getElementById('appMain').innerHTML = `
    <div class="bc-container">
      ${heroBlock}
      <div class="bc-day-grid">${allDayCards}</div>
      <div class="bc-footer">Tip: each day is meant to be done in one sitting. Hit walls? The hint ladder + brute-force walkthrough + in-browser runner are inside each problem panel — use them when you're stuck, not before.</div>
    </div>`;
}

function renderBootcampDay(dayNum) {
  const d = BOOTCAMP_DAYS.find(x => x.day === dayNum);
  if (!d) { closeBootcampDay(); return; }

  const teachDone = isTaskDone(dayNum, 'teach');
  const warmupAutoDone = typeof done !== 'undefined' && done.has(d.warmupEasyId);
  const plungeAutoDone = typeof done !== 'undefined' && done.has(d.plungeMediumId);
  const warmupDone = warmupAutoDone || isTaskDone(dayNum, 'warmup');
  const plungeDone = plungeAutoDone || isTaskDone(dayNum, 'plunge');
  const tasksTotal = 3;
  const tasksDoneCount = [teachDone, warmupDone, plungeDone].filter(Boolean).length;

  // Teach: link to Learn topic(s)
  const topicLinks = (d.teachTopicIds || []).map(tid => {
    const t = LEARNING_TOPICS.find(x => x.id === tid);
    if (!t) return '';
    return `<button class="bc-link" onclick="bootcampGoToTopic('${tid}')">📚 ${t.title}</button>`;
  }).join('');

  // Warmup Easy
  const easyP = problems.find(p => p.id === d.warmupEasyId);
  const easyDiff = easyP ? easyP.difficulty.toLowerCase() : '';
  const warmupBlock = easyP
    ? `<button class="bc-link bc-prob-link" onclick="bootcampGoToProblem(${d.warmupEasyId})">
        <span class="bc-diff ${easyDiff}">${easyP.difficulty}</span>
        <span class="bc-prob-name">${warmupAutoDone ? '✓ ' : ''}${easyP.name}</span>
      </button>`
    : '';

  // Plunge Medium
  const medP = problems.find(p => p.id === d.plungeMediumId);
  const medDiff = medP ? medP.difficulty.toLowerCase() : '';
  const plungeBlock = medP
    ? `<button class="bc-link bc-prob-link" onclick="bootcampGoToProblem(${d.plungeMediumId})">
        <span class="bc-diff ${medDiff}">${medP.difficulty}</span>
        <span class="bc-prob-name">${plungeAutoDone ? '✓ ' : ''}${medP.name}</span>
      </button>`
    : '';

  const mockBlock = d.isMockDay
    ? `<button class="bc-link" onclick="bootcampGoToMock()">🎯 Take a 45-minute Mock Interview (graduation)</button>`
    : '';

  document.getElementById('appMain').innerHTML = `
    <div class="bc-container bc-day-detail">
      <button class="bc-back" onclick="closeBootcampDay()">← Back to Path</button>

      <div class="bc-day-header">
        <div class="bc-day-num-large">DAY ${dayNum} of ${BOOTCAMP_DAYS.length}</div>
        <h1 class="bc-day-h1">${d.title}</h1>
        <div class="bc-day-meta-large">
          <span>⏱ ~${d.estMinutes} min</span>
          <span>·</span>
          <span>${tasksDoneCount}/${tasksTotal} tasks</span>
        </div>
        <p class="bc-day-desc">${d.description}</p>
      </div>

      <div class="bc-task ${teachDone ? 'done' : ''}">
        <div class="bc-task-head">
          <button class="bc-check" onclick="toggleBootcampTask(${dayNum}, 'teach')">${teachDone ? '✓' : '○'}</button>
          <div>
            <div class="bc-task-title">🧠 1. Teach — learn the pattern</div>
            <div class="bc-task-sub">~${Math.round(d.estMinutes * 0.20)} min · just enough vocabulary to attempt today's plunge. Don't try to memorize everything.</div>
          </div>
        </div>
        ${topicLinks ? `<div class="bc-task-actions">${topicLinks}</div>` : '<div class="bc-task-sub">No teach step today.</div>'}
      </div>

      <div class="bc-task ${warmupDone ? 'done' : ''}">
        <div class="bc-task-head">
          <button class="bc-check" onclick="toggleBootcampTask(${dayNum}, 'warmup')">${warmupDone ? '✓' : '○'}</button>
          <div>
            <div class="bc-task-title">🌱 2. Warmup — apply it on an Easy</div>
            <div class="bc-task-sub">~${Math.round(d.estMinutes * 0.15)} min · build the muscle. Hint ladder is one click away if you stall.</div>
          </div>
        </div>
        <div class="bc-task-actions">${warmupBlock}</div>
      </div>

      <div class="bc-task ${plungeDone ? 'done' : ''}">
        <div class="bc-task-head">
          <button class="bc-check" onclick="toggleBootcampTask(${dayNum}, 'plunge')">${plungeDone ? '✓' : '○'}</button>
          <div>
            <div class="bc-task-title">🌊 3. Plunge — a real Medium${d.isMockDay ? ' + Mock' : ''}</div>
            <div class="bc-task-sub">~${Math.round(d.estMinutes * 0.55)} min · the point of today. Try it cold first. If you get stuck, use Hint 1, then Hint 2 — don't jump to the solution.</div>
          </div>
        </div>
        <div class="bc-task-actions">${plungeBlock}</div>
        ${mockBlock ? `<div class="bc-task-actions" style="margin-top:8px">${mockBlock}</div>` : ''}
      </div>

      <div class="bc-day-footer">
        ${bootcampData.completedDays[dayNum]
          ? '<div class="bc-day-already-done">✓ Already marked complete on this date.</div>'
          : `<button class="btn btn-primary bc-complete-btn" onclick="completeBootcampDay(${dayNum})">Mark Day ${dayNum} Complete →</button>`}
      </div>
    </div>`;
}

// ── Helper exposed for the Problems panel's "Up Next" CTA ─────────
// Returns { problemId, label } for the next thing in the active Bootcamp day,
// or { day, label } if the active day's tasks are all done.
function nextBootcampStep(currentProblemId) {
  if (!bootcampData.startedAt) return null;
  const dayNum = bootcampNextDay();
  const d = BOOTCAMP_DAYS.find(x => x.day === dayNum);
  if (!d) return null;
  const isWarmup = currentProblemId === d.warmupEasyId;
  const isPlunge = currentProblemId === d.plungeMediumId;
  if (!isWarmup && !isPlunge) return null;
  const warmupSolved = typeof done !== 'undefined' && done.has(d.warmupEasyId);
  const plungeSolved = typeof done !== 'undefined' && done.has(d.plungeMediumId);
  if (isWarmup && !plungeSolved) {
    const medP = problems.find(p => p.id === d.plungeMediumId);
    return medP ? { problemId: d.plungeMediumId, label: `🌊 Plunge: ${medP.name}` } : null;
  }
  if (isPlunge && plungeSolved && warmupSolved && dayNum < BOOTCAMP_DAYS.length) {
    return { day: dayNum, label: `🎓 Day ${dayNum} complete · Open Day ${dayNum + 1}` };
  }
  return null;
}
