require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';

app.use(express.json());
app.use('/classic', express.static(__dirname));
app.use(express.static(path.join(__dirname, 'client', 'dist')));

let col;

async function getState() {
  return (await col.findOne({ _id: 'user' })) || { _id: 'user', done: [], review: [], problems: {} };
}

app.get('/api/state', async (req, res) => {
  try { res.json(await getState()); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/set-done', async (req, res) => {
  try {
    const { id, value } = req.body;
    const op = value ? { $addToSet: { done: id } } : { $pull: { done: id } };
    await col.updateOne({ _id: 'user' }, op, { upsert: true });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/set-review', async (req, res) => {
  try {
    const { id, value } = req.body;
    const op = value ? { $addToSet: { review: id } } : { $pull: { review: id } };
    await col.updateOne({ _id: 'user' }, op, { upsert: true });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/log-attempt', async (req, res) => {
  try {
    const { id, elapsed, outcome } = req.body;
    await col.updateOne(
      { _id: 'user' },
      { $push: { [`problems.${id}.attempts`]: { ts: Date.now(), elapsed, outcome } } },
      { upsert: true }
    );
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/save-note', async (req, res) => {
  try {
    const { id, text } = req.body;
    await col.updateOne(
      { _id: 'user' },
      { $set: { [`problems.${id}.notes`]: text } },
      { upsert: true }
    );
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/log-mock', async (req, res) => {
  try {
    const { problemId, durationSec, outcome, rubric } = req.body;
    await col.updateOne(
      { _id: 'user' },
      { $push: { mockHistory: { ts: Date.now(), problemId, durationSec, outcome, rubric } } },
      { upsert: true }
    );
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/learning', async (req, res) => {
  try {
    const { topicId, field, value } = req.body;
    await col.updateOne(
      { _id: 'user' },
      { $set: {
          [`learning.${topicId}.${field}`]: value,
          [`learning.${topicId}.lastVisited`]: Date.now(),
      } },
      { upsert: true }
    );
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/log-quiz', async (req, res) => {
  try {
    const { quizType, questionId, correct } = req.body;
    await col.updateOne(
      { _id: 'user' },
      { $push: { [`quiz.${quizType}.${questionId}.attempts`]: { ts: Date.now(), correct } } },
      { upsert: true }
    );
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/export', async (req, res) => {
  try {
    const state = await getState();
    delete state._id;
    res.setHeader('Content-Disposition', 'attachment; filename="blind75-backup.json"');
    res.json(state);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/import', async (req, res) => {
  try {
    const data = { ...req.body, _id: 'user' };
    await col.replaceOne({ _id: 'user' }, data, { upsert: true });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

MongoClient.connect(MONGO_URI)
  .then(client => {
    col = client.db('blind75').collection('state');
    app.listen(PORT, () => console.log(`Blind 75 → http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
