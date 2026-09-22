import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const PROBLEMS = [
  { id: 'two-sum', title: 'Two Sum', category: 'Arrays & Hashing', difficulty: 'Easy', prompt: 'Find two indices whose values add to the target.' },
  { id: 'valid-parentheses', title: 'Valid Parentheses', category: 'Stack', difficulty: 'Easy', prompt: 'Determine whether brackets close in the correct order.' },
  { id: 'longest-substring', title: 'Longest Substring Without Repeating Characters', category: 'Sliding Window', difficulty: 'Medium', prompt: 'Find the longest substring containing no repeated characters.' },
  { id: 'merge-intervals', title: 'Merge Intervals', category: 'Intervals', difficulty: 'Medium', prompt: 'Merge all overlapping intervals.' },
  { id: 'word-ladder', title: 'Word Ladder', category: 'Graphs', difficulty: 'Hard', prompt: 'Find the shortest transformation sequence between two words.' }
];

async function request(url, options = {}) {
  const response = await fetch(url, { credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, ...options });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Could not save your progress.');
  return data;
}

export function App() {
  const [state, setState] = useState({ done: [], review: [], problems: {} });
  const [selectedId, setSelectedId] = useState(PROBLEMS[0].id);
  const [search, setSearch] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const selected = PROBLEMS.find((problem) => problem.id === selectedId) || PROBLEMS[0];
  const filtered = useMemo(() => PROBLEMS.filter((p) => `${p.title} ${p.category}`.toLowerCase().includes(search.toLowerCase())), [search]);

  useEffect(() => { request('/api/state').then(setState).catch((e) => setError(e.message)); }, []);
  useEffect(() => { setNote(state.problems?.[selected.id]?.notes || ''); }, [selected.id, state.problems]);
  useEffect(() => { setSeconds(0); setRunning(false); }, [selected.id]);
  useEffect(() => { if (!running) return undefined; const timer = setInterval(() => setSeconds((value) => value + 1), 1000); return () => clearInterval(timer); }, [running]);

  const update = async (url, body, optimistic) => {
    setError(''); setSaving(true); setState((current) => optimistic(current));
    try { await request(url, { method: 'POST', body: JSON.stringify(body) }); }
    catch (e) { setError(e.message); const fresh = await request('/api/state').catch(() => state); setState(fresh); }
    finally { setSaving(false); }
  };
  const toggleDone = () => update('/api/set-done', { id: selected.id, value: !state.done.includes(selected.id) }, (s) => ({ ...s, done: s.done.includes(selected.id) ? s.done.filter((id) => id !== selected.id) : [...s.done, selected.id] }));
  const toggleReview = () => update('/api/set-review', { id: selected.id, value: !state.review.includes(selected.id) }, (s) => ({ ...s, review: s.review.includes(selected.id) ? s.review.filter((id) => id !== selected.id) : [...s.review, selected.id] }));
  const saveNote = () => update('/api/save-note', { id: selected.id, text: note }, (s) => ({ ...s, problems: { ...s.problems, [selected.id]: { ...(s.problems?.[selected.id] || {}), notes: note } } }));
  const logAttempt = (outcome) => update('/api/log-attempt', { id: selected.id, elapsed: seconds, outcome }, (s) => ({ ...s, problems: { ...s.problems, [selected.id]: { ...(s.problems?.[selected.id] || {}), attempts: [...(s.problems?.[selected.id]?.attempts || []), { elapsed: seconds, outcome, ts: Date.now() }] } } }));
  const formatTime = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  return <main className="practice-shell">
    <nav className="practice-nav"><a className="brand" href="/">love<span>code</span></a><span className="session-label">Private guest session · progress saves automatically</span><a href="/classic/">Full study workspace →</a></nav>
    <header className="practice-header"><div><p className="eyebrow">CORE PRACTICE JOURNEY</p><h1>Build interview confidence.</h1><p className="lede">Choose a problem, write down your approach, and come back to the same session whenever you need to.</p></div><div className="progress-card"><strong>{state.done.length}/{PROBLEMS.length}</strong><span>core problems complete</span><div className="progress-track"><i style={{ width: `${(state.done.length / PROBLEMS.length) * 100}%` }} /></div></div></header>
    {error && <div className="notice error" role="alert">{error}</div>}
    <section className="practice-grid"><aside className="problem-picker"><label htmlFor="search">Find a problem</label><input id="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title or pattern" />{filtered.map((problem) => <button className={problem.id === selected.id ? 'problem selected' : 'problem'} key={problem.id} onClick={() => setSelectedId(problem.id)}><span>{problem.title}</span><small>{problem.difficulty} · {problem.category}</small></button>)}</aside>
      <article className="problem-card"><div className="problem-meta"><span>{selected.category}</span><span>{selected.difficulty}</span></div><h2>{selected.title}</h2><p className="prompt">{selected.prompt}</p><div className="timer"><strong>{formatTime}</strong><button className="action" onClick={() => setRunning((value) => !value)}>{running ? 'Pause timer' : 'Start timer'}</button><button className="action" onClick={() => { setSeconds(0); setRunning(false); }}>Reset</button></div><div className="callout">Start by describing the simplest correct approach. Then name its time and space complexity before you code.</div><label htmlFor="notes">Your approach and notes</label><textarea id="notes" value={note} onChange={(e) => setNote(e.target.value)} placeholder="What pattern do you see? What edge cases matter?" /><div className="actions"><button className="primary" onClick={saveNote} disabled={saving}>{saving ? 'Saving…' : 'Save notes'}</button><button className={state.done.includes(selected.id) ? 'active action' : 'action'} onClick={toggleDone}>{state.done.includes(selected.id) ? '✓ Completed' : 'Mark complete'}</button><button className={state.review.includes(selected.id) ? 'active action' : 'action'} onClick={toggleReview}>{state.review.includes(selected.id) ? '★ Review later' : '☆ Add to review'}</button></div><div className="outcomes"><span>Log result:</span><button onClick={() => logAttempt('solved')}>Solved</button><button onClick={() => logAttempt('hint')}>Needed a hint</button><button onClick={() => logAttempt('stuck')}>Stuck</button></div><p className="save-state" aria-live="polite">{saving ? 'Saving your session…' : 'Your session is saved to this browser.'}</p></article>
    </section>
    <footer><span>LoveCode · deliberate practice for technical interviews</span><a href="/classic/">Explore Learn, Drills, Mock, and more →</a></footer>
  </main>;
}

if (typeof document !== 'undefined') createRoot(document.getElementById('root')).render(<App />);
