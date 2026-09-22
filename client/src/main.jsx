import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const tracks = [
  ['Learn', 'Build intuition with guided patterns, examples, and complexity notes.'],
  ['Drill', 'Turn weak spots into repeatable interview muscle with active recall.'],
  ['Mock', 'Practice communicating a solution under a realistic interview timer.']
];

export function App() {
  return <main className="shell">
    <nav><strong>love<span>code</span></strong><a href="/classic">Open full practice app →</a></nav>
    <section className="hero"><p className="eyebrow">INTERVIEW PRACTICE, WITH A PLAN</p><h1>Make every coding session count.</h1><p className="lede">A focused workspace for learning patterns, solving problems, and building the communication habits that turn preparation into confident interviews.</p><div className="actions"><a className="primary" href="/classic">Start practicing</a><a className="secondary" href="#tracks">See the workflow</a></div></section>
    <section id="tracks" className="tracks">{tracks.map(([title, text], i) => <article key={title}><span>0{i + 1}</span><h2>{title}</h2><p>{text}</p></article>)}</section>
    <footer><span>Built for deliberate practice.</span><a href="/classic">Open the full Blind 75 workspace →</a></footer>
  </main>;
}

if (typeof document !== 'undefined') createRoot(document.getElementById('root')).render(<App />);
