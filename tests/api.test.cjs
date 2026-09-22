const {test} = require('node:test');
const assert = require('node:assert/strict');
const {createApp} = require('../server');

test('API validates input, saves notes, and protects server files', async t => {
  const stored = new Map();
  const collection = {
    findOne: async (query) => structuredClone(stored.get(query._id) || {_id: query._id, done:[], review:[], problems:{}}),
    updateOne: async (query, update) => { const current = stored.get(query._id) || {_id:query._id,done:[],review:[],problems:{}}; if(update.$set) for(const [key,value] of Object.entries(update.$set)) {const [,id] = key.split('.'); current.problems[id] = {notes:value};} stored.set(query._id,current); },
    replaceOne: async (query, data) => {stored.set(query._id, structuredClone(data));}
  };
  const server = createApp(collection).listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  const options = {headers: {'Content-Type':'application/json', Cookie:'lovecode_sid=test-session'}};
  const post = (path, body) => fetch(base+path, {method:'POST',...options,body:JSON.stringify(body)});
  const get = (path) => fetch(base+path, options);
  assert.equal((await get('/classic/server.js')).status,404);
  assert.equal((await get('/classic/package.json')).status,404);
  assert.equal((await get('/classic/')).status,200);
  assert.equal((await get('/classic/js/main.js')).status,200);
  assert.equal((await post('/api/save-note',{id:'bad.path',text:'x'})).status,400);
  assert.equal((await post('/api/set-done',{id:1,value:'false'})).status,400);
  assert.equal((await post('/api/log-attempt',{id:'1',elapsed:-1,outcome:'solved'})).status,400);
  assert.equal((await post('/api/log-attempt',{id:'1',elapsed:42,outcome:'solved'})).status,200);
  assert.equal((await post('/api/save-note',{id:1,text:'Review sliding windows'})).status,200);
  assert.equal((await (await get('/api/state')).json()).problems['1'].notes,'Review sliding windows');
  const exported = await (await get('/api/export')).json();
  assert.equal(exported._id,undefined);
  assert.equal((await post('/api/import', exported)).status,200);
  assert.deepEqual((await (await get('/api/state')).json()).problems, exported.problems);
  const otherState = await (await fetch(base+'/api/state', {headers: {Cookie:'lovecode_sid=other-session'}})).json();
  assert.deepEqual(otherState.problems, {});
});

test('database errors do not disclose connection details', async t => {
  const server = createApp({findOne:async () => {throw new Error('secret-connection-string');}}).listen(0,'127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const response = await fetch(`http://127.0.0.1:${server.address().port}/api/state`, {headers: {Cookie:'lovecode_sid=test-session'}});
  assert.equal(response.status,500);
  assert.doesNotMatch(await response.text(),/secret-connection/);
});
