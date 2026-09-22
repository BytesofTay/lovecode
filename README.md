# LoveCode

LoveCode is a deliberate-practice workspace for technical interviews. It combines a React landing experience with the full browser-based study workspace: guided data-structure lessons, active-recall drills, Big-O and sorting practice, 90 interview problems, and timed mock interviews.

## Product surface

- **Learn:** 25 guided topics with worked examples, pitfalls, complexity notes, and line-by-line practice.
- **Drills:** Pattern and vocabulary recall with accuracy tracking and wrong-answer requeueing.
- **Problems:** 90 problems with timers, notes, attempt history, review flags, and canonical approaches.
- **Mock:** Timed interview rounds with a communication rubric and session history.
- **Data portability:** JSON export/import for a personal backup.

## Stack

- **React + Vite:** responsive product landing page in `client/`.
- **Node.js + Express:** API and static hosting in `server.js`.
- **MongoDB:** persistence for progress, notes, attempts, quizzes, and mock sessions.
- **Legacy study UI:** the complete learning workspace remains available at `/classic` while the React migration continues incrementally.

## Run locally

Prerequisites: Node.js 18+ and MongoDB.

```bash
npm install
npm run build
MONGO_URI=mongodb://localhost:27017 PORT=3000 npm start
```

Open `http://localhost:3000` for the React experience or `http://localhost:3000/classic` for the complete practice workspace.

For development, run `npm run build` after client changes and `npm run dev` for the Express server. The API uses `/api/state`, `/api/set-done`, `/api/set-review`, `/api/log-attempt`, `/api/save-note`, `/api/log-quiz`, `/api/log-mock`, `/api/learning`, `/api/export`, and `/api/import`.

## Quality and security

- `.env` and `.env.*` are ignored; keep local MongoDB credentials out of Git.
- `npm test` checks the React entry point.
- `npm run build` verifies the production client bundle.
- GitHub Actions runs both checks on pushes and pull requests.

## Roadmap

1. Move the study modes into React components while preserving the existing data model.
2. Add authenticated profiles and isolated user state.
3. Add optional LLM orchestration for hints and rubric feedback, with explicit user controls.
4. Add source refresh jobs and async workers for content updates.

## License

Private-use project. No license is granted for redistribution.
