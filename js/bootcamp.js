// ── Bootcamp mode: 14-Day curriculum with daily packs ─────────────────────
// State persists to localStorage. Each day has a checklist; complete all
// items to mark the day done and unlock the next.

const BOOTCAMP_STATE_KEY = 'lovecode_bootcamp';
let bootcampData = {
  startedAt: null,           // ms timestamp of "Start Bootcamp" click
  completedDays: {},         // { 1: timestamp, 2: timestamp, ... }
  taskDone: {},              // { '1-learn': true, '1-drills': true, '1-problems': true, '1-recall': true }
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
  // Streak = max consecutive day numbers completed starting from day 1
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

function dayProgress(dayNum) {
  const tasks = ['learn', 'drills', 'problems', 'recall'];
  const done = tasks.filter(t => isTaskDone(dayNum, t)).length;
  return { done, total: tasks.length };
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
  if (!confirm('Reset all bootcamp progress? Your completion data will be lost (other quiz/learning data is unaffected).')) return;
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
    return `<div class="${cls}" ${onclick}>
      <div class="bc-day-num">DAY ${d.day}</div>
      <div class="bc-day-title">${d.title}</div>
      <div class="bc-day-meta">
        <span>⏱ ~${d.estMinutes} min</span>
        ${statusBadge}
      </div>
    </div>`;
  };

  const week1 = BOOTCAMP_DAYS.filter(d => d.week === 1).map(dayCard).join('');
  const week2 = BOOTCAMP_DAYS.filter(d => d.week === 2).map(dayCard).join('');

  const heroBlock = started
    ? `<div class="bc-hero">
        <div class="bc-hero-left">
          <div class="bc-hero-title">🚀 14-Day Interview Bootcamp</div>
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
        <div class="bc-hero-title">🚀 14-Day Interview Bootcamp</div>
        <p class="bc-hero-blurb">A structured daily course that takes you from foundations to pattern fluency in two weeks. Each day: 1 topic to learn, 8 minutes of drills, 2-3 priority problems, and a recall review. ~2 hours/day.</p>
        <p class="bc-hero-blurb"><strong>Honest take:</strong> 14 days is realistic if you have some CS background and grind 2-3 hours daily. From zero, plan on 4-6 weeks. Either way, the path is the same — start now.</p>
        <button class="btn btn-primary" onclick="startBootcamp()">▶ Start the Bootcamp</button>
      </div>`;

  document.getElementById('appMain').innerHTML = `
    <div class="bc-container">
      ${heroBlock}
      <div class="bc-week-label">Week 1 · Foundations</div>
      <div class="bc-day-grid">${week1}</div>
      <div class="bc-week-label">Week 2 · Patterns</div>
      <div class="bc-day-grid">${week2}</div>
      <div class="bc-footer">Tip: each day is meant to be done in one sitting. Mark tasks as you finish them; complete all four to unlock the next day.</div>
    </div>`;
}

function renderBootcampDay(dayNum) {
  const d = BOOTCAMP_DAYS.find(x => x.day === dayNum);
  if (!d) { closeBootcampDay(); return; }

  const learnDone = isTaskDone(dayNum, 'learn');
  const drillsDone = isTaskDone(dayNum, 'drills');
  const problemsDone = isTaskDone(dayNum, 'problems');
  const recallDone = isTaskDone(dayNum, 'recall');
  const tasksTotal = 4;
  const tasksDoneCount = [learnDone, drillsDone, problemsDone, recallDone].filter(Boolean).length;

  // 1. Learn topics block
  const topicLinks = d.topicIds.map(tid => {
    const t = LEARNING_TOPICS.find(x => x.id === tid);
    if (!t) return '';
    return `<button class="bc-link" onclick="bootcampGoToTopic('${tid}')">📚 ${t.title}</button>`;
  }).join('');

  // 2. Drills target
  const drill = BOOTCAMP_DRILL_TARGETS[d.drillFocus];
  const drillBlock = drill
    ? `<button class="bc-link" onclick="bootcampGoToDrill('${d.drillFocus}')">${drill.label} — ${drill.desc}</button>`
    : '';

  // 3. Problem links
  const probLinks = d.problemIds.map(pid => {
    const p = problems.find(x => x.id === pid);
    if (!p) return '';
    const dCls = p.difficulty.toLowerCase();
    const isDoneProb = done.has(pid) ? '✓ ' : '';
    return `<button class="bc-link bc-prob-link" onclick="bootcampGoToProblem(${pid})">
      <span class="bc-diff ${dCls}">${p.difficulty}</span>
      <span class="bc-prob-name">${isDoneProb}${p.name}</span>
    </button>`;
  }).join('');

  // 4. Mock-day flag
  const mockBlock = d.isMockDay
    ? `<button class="bc-link" onclick="bootcampGoToMock()">🎯 Take a 45-minute Mock Interview</button>`
    : '';

  document.getElementById('appMain').innerHTML = `
    <div class="bc-container bc-day-detail">
      <button class="bc-back" onclick="closeBootcampDay()">← Back to Bootcamp Map</button>

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

      <div class="bc-task ${learnDone ? 'done' : ''}">
        <div class="bc-task-head">
          <button class="bc-check" onclick="toggleBootcampTask(${dayNum}, 'learn')">${learnDone ? '✓' : '○'}</button>
          <div>
            <div class="bc-task-title">1. Learn the topic${d.topicIds.length > 1 ? 's' : ''}</div>
            <div class="bc-task-sub">~${Math.round(d.estMinutes * 0.20)} min · read the explainer + take comprehension checks</div>
          </div>
        </div>
        ${topicLinks ? `<div class="bc-task-actions">${topicLinks}</div>` : '<div class="bc-task-sub">Skip this — today\'s focus is review.</div>'}
      </div>

      <div class="bc-task ${drillsDone ? 'done' : ''}">
        <div class="bc-task-head">
          <button class="bc-check" onclick="toggleBootcampTask(${dayNum}, 'drills')">${drillsDone ? '✓' : '○'}</button>
          <div>
            <div class="bc-task-title">2. Drill the patterns</div>
            <div class="bc-task-sub">~${Math.round(d.estMinutes * 0.15)} min · drive snap recognition</div>
          </div>
        </div>
        <div class="bc-task-actions">${drillBlock}</div>
      </div>

      <div class="bc-task ${problemsDone ? 'done' : ''}">
        <div class="bc-task-head">
          <button class="bc-check" onclick="toggleBootcampTask(${dayNum}, 'problems')">${problemsDone ? '✓' : '○'}</button>
          <div>
            <div class="bc-task-title">3. Solve today's problems</div>
            <div class="bc-task-sub">~${Math.round(d.estMinutes * 0.55)} min · the bulk of the day. Try LeetCode-style: 25 min struggle before peeking</div>
          </div>
        </div>
        ${probLinks ? `<div class="bc-task-actions bc-prob-list">${probLinks}</div>` : ''}
        ${mockBlock ? `<div class="bc-task-actions" style="margin-top:8px">${mockBlock}</div>` : ''}
      </div>

      <div class="bc-task ${recallDone ? 'done' : ''}">
        <div class="bc-task-head">
          <button class="bc-check" onclick="toggleBootcampTask(${dayNum}, 'recall')">${recallDone ? '✓' : '○'}</button>
          <div>
            <div class="bc-task-title">4. End-of-day Recall</div>
            <div class="bc-task-sub">~${Math.round(d.estMinutes * 0.10)} min · 5-10 flashcards before you stop</div>
          </div>
        </div>
        <div class="bc-task-actions">
          <button class="bc-link" onclick="bootcampGoToDrill('flashcards')">📇 Open Recall Flashcards</button>
        </div>
      </div>

      <div class="bc-day-footer">
        ${bootcampData.completedDays[dayNum]
          ? '<div class="bc-day-already-done">✓ Already marked complete on this date.</div>'
          : `<button class="btn btn-primary bc-complete-btn" onclick="completeBootcampDay(${dayNum})">Mark Day ${dayNum} Complete →</button>`}
      </div>
    </div>`;
}
