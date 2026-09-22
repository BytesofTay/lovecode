const {test} = require('node:test');
const assert = require('node:assert/strict');
const {createApp} = require('../server');

test('API validates input, saves notes, and protects server files', async t => {
  let stored = {_id:'user', done:[], review:[], problems:{}};
  const collection = {
    findOne: async () => structuredClone(stored),
    updateOne: async (_, update) => { if(update.$set) for(const [key,value] of Object.entries(update.$set)) {const [,id] = key.split('.'); stored.problems[id] = {notes:value};} },
    replaceOne: async (_, data) => {stored = structuredClone(data);}
  };
  const server = createApp(collection).listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (path, body) => fetch(base+path, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  assert.equal((await fetch(base+'/classic/server.js')).status,404);
  assert.equal((await fetch(base+'/classic/package.json')).status,404);
  assert.equal((await fetch(base+'/classic/')).status,200);
  assert.equal((await fetch(base+'/classic/js/main.js')).status,200);
  assert.equal((await post('/api/save-note',{id:'bad.path',text:'x'})).status,400);
  assert.equal((await post('/api/set-done',{id:1,value:'false'})).status,400);
  assert.equal((await post('/api/save-note',{id:1,text:'Review sliding windows'})).status,200);
  assert.equal((await (await fetch(base+'/api/state')).json()).problems['1'].notes,'Review sliding windows');
  const exported = await (await fetch(base+'/api/export')).json();
  assert.equal(exported._id,undefined);
  assert.equal((await post('/api/import', exported)).status,200);
  assert.deepEqual((await (await fetch(base+'/api/state')).json()).problems, exported.problems);
});

test('database errors do not disclose connection details', async t => {
  const server = createApp({findOne:async () => {throw new Error('secret-connection-string');}}).listen(0,'127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const response = await fetch(`http://127.0.0.1:${server.address().port}/api/state`);
  assert.equal(response.status,500);
  assert.doesNotMatch(await response.text(),/secret-connection/);
});
