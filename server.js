require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const crypto = require('crypto');

function createApp(col) {
const app = express();
app.enable('strict routing');
app.disable("x-powered-by");
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';

app.use(express.json());
app.use((req, res, next) => {
  const match = /(?:^|;\s*)lovecode_sid=([^;]+)/.exec(req.headers.cookie || '');
  const sid = match?.[1] || crypto.randomBytes(24).toString('hex');
  req.lovecodeSid = sid;
  if (!match) res.setHeader('Set-Cookie', `lovecode_sid=${sid}; HttpOnly; SameSite=Lax; Path=/; Max-Age=2592000`);
  next();
});
app.get('/classic', (req, res) => res.redirect('/classic/'));
app.get('/classic/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
for (const folder of ['js', 'css']) app.use(`/classic/${folder}`, express.static(path.join(__dirname, folder)));
app.get('/api/health', (req, res) => res.json({status: 'ok'}));
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// Reject unsafe MongoDB path segments before constructing update paths.
app.use('/api', (req, res, next) => {
  if (req.method !== 'POST') return next();
  const body = req.body;
  if (!body || Array.isArray(body) || typeof body !== 'object') return res.status(400).json({error: 'Expected a JSON object'});
  const fields = {
    '/set-done': ['id'], '/set-review': ['id'], '/save-note': ['id'],
    '/log-attempt': ['id'], '/learning': ['topicId', 'field'],
    '/log-quiz': ['quizType', 'questionId'], '/log-mock': ['problemId']
  }[req.path] || [];
  if (fields.some(key => !['string', 'number'].includes(typeof body[key]) || !/^[a-zA-Z0-9_-]{1,100}$/.test(String(body[key])) || ['__proto__', 'constructor', 'prototype'].includes(String(body[key])))) return res.status(400).json({error: 'Invalid identifier'});
  if (['/set-done', '/set-review'].includes(req.path) && typeof body.value !== 'boolean') return res.status(400).json({error: 'Expected boolean value'});
  if (req.path === '/save-note' && (typeof body.text !== 'string' || body.text.length > 20000)) return res.status(400).json({error: 'Invalid note'});
  if (req.path === '/learning' && !['videoWatched', 'complete', 'lastVisited'].includes(body.field)) return res.status(400).json({error: 'Invalid learning field'});
  next();
});

async function getState(req) {
  return (await col.findOne({ _id: req.lovecodeSid })) || { _id: req.lovecodeSid, done: [], review: [], problems: {} };
}

app.get('/api/state', async (req, res) => {
  try { res.json(await getState(req)); }
  catch (e) { res.status(500).json({ error: "Unable to save or load study data" }); }
});

app.post('/api/set-done', async (req, res) => {
  try {
    const { id, value } = req.body;
    const op = value ? { $addToSet: { done: id } } : { $pull: { done: id } };
    await col.updateOne({ _id: req.lovecodeSid }, op, { upsert: true });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: "Unable to save or load study data" }); }
});

app.post('/api/set-review', async (req, res) => {
  try {
    const { id, value } = req.body;
    const op = value ? { $addToSet: { review: id } } : { $pull: { review: id } };
    await col.updateOne({ _id: req.lovecodeSid }, op, { upsert: true });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: "Unable to save or load study data" }); }
});

app.post('/api/log-attempt', async (req, res) => {
  try {
    const { id, elapsed, outcome } = req.body;
    await col.updateOne(
      { _id: req.lovecodeSid },
      { $push: { [`problems.${id}.attempts`]: { ts: Date.now(), elapsed, outcome } } },
      { upsert: true }
    );
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: "Unable to save or load study data" }); }
});

app.post('/api/save-note', async (req, res) => {
  try {
    const { id, text } = req.body;
    await col.updateOne(
      { _id: req.lovecodeSid },
      { $set: { [`problems.${id}.notes`]: text } },
      { upsert: true }
    );
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: "Unable to save or load study data" }); }
});

app.post('/api/log-mock', async (req, res) => {
  try {
    const { problemId, durationSec, outcome, rubric } = req.body;
    await col.updateOne(
      { _id: req.lovecodeSid },
      { $push: { mockHistory: { ts: Date.now(), problemId, durationSec, outcome, rubric } } },
      { upsert: true }
    );
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: "Unable to save or load study data" }); }
});

app.post('/api/learning', async (req, res) => {
  try {
    const { topicId, field, value } = req.body;
    await col.updateOne(
      { _id: req.lovecodeSid },
      { $set: {
          [`learning.${topicId}.${field}`]: value,
          [`learning.${topicId}.lastVisited`]: Date.now(),
      } },
      { upsert: true }
    );
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: "Unable to save or load study data" }); }
});

app.post('/api/log-quiz', async (req, res) => {
  try {
    const { quizType, questionId, correct } = req.body;
    await col.updateOne(
      { _id: req.lovecodeSid },
      { $push: { [`quiz.${quizType}.${questionId}.attempts`]: { ts: Date.now(), correct } } },
      { upsert: true }
    );
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: "Unable to save or load study data" }); }
});

app.get('/api/export', async (req, res) => {
  try {
    const state = await getState(req);
    delete state._id;
    res.setHeader('Content-Disposition', 'attachment; filename="blind75-backup.json"');
    res.json(state);
  } catch (e) { res.status(500).json({ error: "Unable to save or load study data" }); }
});

app.post('/api/import', async (req, res) => {
  try {
    const data = { ...req.body, _id: req.lovecodeSid };
    await col.replaceOne({ _id: req.lovecodeSid }, data, { upsert: true });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: "Unable to save or load study data" }); }
});

return app;
}
module.exports = { createApp };

if (require.main === module) MongoClient.connect(MONGO_URI)
  .then(client => {
    const app = createApp(client.db('blind75').collection('state'));
    app.listen(PORT, process.env.HOST || '127.0.0.1', () => console.log(`Blind 75 → http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
