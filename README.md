# lovecode

A self-contained study tool for technical interviews. Built around the Blind 75 problem set, expanded to 90 problems with 25 conceptual learning topics, drills, and active-production exercises.

## What's in the app

Six tabs accessible from the top of the page.

### Learn
25 topics covering every Blind 75 category and pattern, grouped into Foundations, Data Structures, and Patterns. Each topic includes:

- A sectioned explanation (What it is / How it works / When to reach for it)
- 2–4 worked examples per topic with code, time/space complexity, and an inline insight
- Common-pitfall callouts ("Watch out for")
- A Quick Recap bullet list
- A reference video search button (uses YouTube search, no embed required)
- "Explain each line" — line-by-line annotations on the most important examples (Two Sum, Reverse Linked List, Binary Search, Sliding Window, Recursion, BFS/DFS, Subsets backtracking, DP Fibonacci)
- "Type it yourself" — a textarea where you implement from scratch, with a hide/show reference and live whitespace-normalized line-match diff
- Two comprehension checks per example (one easy, one hard) with feedback and rotating question pools on key examples
- A "Try it on Blind 75" button that jumps you to the matching problem

Topics are tagged Foundations (purple), Data Structures (blue), or Patterns (orange). Bit Manipulation is marked OPTIONAL. Dynamic Programming is marked CAPSTONE and ordered last; the topic page shows your prerequisite progress before you tackle it.

### Drills
Two sub-modes for active recall:

- **Patterns** — 40 problem scenarios. Pick the best pattern from 4 options. Each session draws 15 random questions from the pool. Wrong-answer feedback explains why your specific pick doesn't fit. Difficulty levels: easy / medium / hard / advanced.
- **Vocab** — 50 technical terms. Match definition to term, with random distractors per session. When you pick wrong, the app shows what your wrong choice actually means so you learn two terms at once.

Both quizzes track per-question accuracy across sessions, support spaced repetition (wrong answers re-queue mid-session), and surface weakness analytics in the sidebar.

### Big-O
33-question quiz across all 7 complexity classes (O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ), O(n!)). Includes 6 code-snippet questions where you read actual Python and identify the complexity. Sidebar shows accuracy bars per complexity class so you see which classes you're weak on.

### Sorting
Reference + practice for 5 sorting algorithms (Merge, Quick, Heap, Insertion, Selection). For each algorithm: time/space/stable stats, the key idea, when to use it, and pseudocode. A step-through tracer animates each algorithm sorting `[5, 2, 8, 1, 9, 3]` with a description per step. A 10-question quiz tests comparative knowledge (stability, space, worst case, when to use which).

### Problems
All 90 problems (Blind 75 + 15 Hard-tier additions: Trapping Rain Water, Sliding Window Maximum, LRU Cache, Largest Rectangle, Edit Distance, Regex Matching, etc.).

Each problem has:
- A 20-minute timer with audio alarm
- Buttons that link to the LeetCode page and to YouTube search (auto-starts the timer)
- Three outcome buttons: Solved / Needed Hint / Watched Solution
- Attempt history with elapsed time and outcome per attempt
- A note field that auto-saves
- A manual "Mark for Review" toggle
- A "Show Optimal Approach" reveal that displays the canonical approach + time/space + key insight

Sidebar filters: difficulty, category, status (All / Not Done / Done / Needs Review / Due for Spaced Review). Problems solved 14+ days ago surface in the spaced-review filter automatically.

Categories show progress bars and graduate to a Mastered section once 80% of their problems are done.

### Mock
A simulated interview round. Click "Start Mock Interview" to get a random unsolved problem, a 45-minute timer, and a LeetCode link — but no Show Solution button. Three outcome buttons end the mock: Solved Cleanly / Solved After Hint / Stuck. After ending, a 5-question self-grade rubric covers communication skills (stating complexity, identifying edge cases, walking through approach verbally, etc.). Mock history is saved and displayed in the sidebar.

## Tech stack

- **Frontend:** single `index.html` file. Vanilla HTML / CSS / JS. No frameworks, no build step.
- **Backend:** Express.js. ~120 lines.
- **Database:** MongoDB (local).
- **State:** Persisted server-side. Includes problem completion, review flags, attempts with timestamps, notes, quiz attempts (Big-O, Sorting, Patterns, Vocab), Learn topic progress, and mock interview history.

The app is mobile-responsive (breakpoint at 768px) and supports JSON export/import for backup.

## Setup

Prerequisites: Node.js 18+, MongoDB running locally on `mongodb://localhost:27017`.

```bash
git clone https://github.com/BytesofTay/lovecode
cd lovecode
npm install

# Optional: create .env if you want to override defaults
echo "MONGO_URI=mongodb://localhost:27017
PORT=3001" > .env

# Make sure MongoDB is running
mongod --dbpath ~/data/db &     # or however you run it

node server.js
```

The server listens on port 3000 by default (or whatever `PORT` env var you set). Open http://localhost:3001/ (or 3000 if you didn't set PORT).

## Project structure

```
.
├── index.html       # The whole frontend — all 25 topics, 40 pattern questions,
│                    # 50 vocab terms, 90 problems, all CSS, all JS
├── server.js        # Express server with REST endpoints for state persistence
├── package.json
├── .gitignore       # Excludes .env and node_modules
└── README.md
```

## API endpoints

The frontend talks to the server via a small REST API:

| Method | Path | Purpose |
|--------|------|---------|
| GET    | `/api/state` | Read entire user state |
| POST   | `/api/set-done` | Mark/unmark a problem as done |
| POST   | `/api/set-review` | Mark/unmark for review |
| POST   | `/api/log-attempt` | Record a problem attempt with elapsed time + outcome |
| POST   | `/api/save-note` | Save problem notes (debounced from the UI) |
| POST   | `/api/log-quiz` | Record a quiz answer (Big-O / Sorting / Pattern / Vocab) |
| POST   | `/api/log-mock` | Record a mock interview session |
| POST   | `/api/learning` | Update Learn topic progress |
| GET    | `/api/export` | Download full state as JSON |
| POST   | `/api/import` | Replace state from JSON |

State document shape (single document in MongoDB collection `state`):

```js
{
  _id: 'user',
  done: [problemId, ...],
  review: [problemId, ...],
  problems: { [id]: { attempts: [{ts, elapsed, outcome}], notes: '...' } },
  quiz: {
    bigo:    { [questionId]: { attempts: [{ts, correct}] } },
    sorting: { [questionId]: { attempts: [{ts, correct}] } },
    pattern: { [questionId]: { attempts: [{ts, correct}] } },
    vocab:   { [questionId]: { attempts: [{ts, correct}] } }
  },
  learning: { [topicId]: { videoWatched, complete, lastVisited } },
  mockHistory: [{ts, problemId, durationSec, outcome, rubric}]
}
```

## Development notes

- The frontend is one big HTML file (~487KB). All data — problems, solutions, quiz questions, vocab terms, sorting algorithms, line-by-line annotations, comprehension questions — is inline as JS constants. Adding a new question, problem, or annotation means editing one file.
- No frontend framework. The render layer uses string templates and direct DOM updates.
- All inline SVG diagrams are functions that return SVG strings. Animated diagrams (BFS/DFS, DP table, sliding window, two-pointer) use CSS keyframes with staggered delays.
- The sorting step-tracer runs all 5 algorithms and emits state per step. Verified correct on `[5, 2, 8, 1, 9, 3] → [1, 2, 3, 5, 8, 9]`.
- Problem solutions, comprehension questions, and per-line annotations are authored in JS objects keyed by topic ID and example index.

## License

Private repo — no license. For personal use.
