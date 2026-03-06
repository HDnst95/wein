'use strict';

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http   = require('node:http');

// Use an in-memory DB for tests
process.env.DB_PATH = ':memory:';
process.env.PORT = '0'; // let the OS assign a free port

const app = require('../server');

let server;
let baseUrl;

before(() => new Promise(resolve => {
  server = app.listen(0, () => {
    const { port } = server.address();
    baseUrl = `http://localhost:${port}`;
    resolve();
  });
}));

after(() => new Promise(resolve => {
  server.close(resolve);
}));

/** Small fetch-like helper using core http */
function req(method, path, body) {
  return new Promise((resolve, reject) => {
    const raw = body ? JSON.stringify(body) : null;
    const opts = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(raw ? { 'Content-Length': Buffer.byteLength(raw) } : {}),
      },
    };
    const r = http.request(`${baseUrl}${path}`, opts, res => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: data ? JSON.parse(data) : null,
        });
      });
    });
    r.on('error', reject);
    if (raw) r.write(raw);
    r.end();
  });
}

describe('Wines API', () => {
  let createdId;

  it('GET /api/wines – empty list', async () => {
    const res = await req('GET', '/api/wines');
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, []);
  });

  it('POST /api/wines – create a wine', async () => {
    const res = await req('POST', '/api/wines', {
      name: 'Testrotwein',
      year: 2020,
      type: 'Rotwein',
      quantity: 3,
    });
    assert.equal(res.status, 201);
    assert.equal(res.body.name, 'Testrotwein');
    assert.equal(res.body.quantity, 3);
    createdId = res.body.id;
  });

  it('POST /api/wines – returns 400 without name', async () => {
    const res = await req('POST', '/api/wines', { year: 2021 });
    assert.equal(res.status, 400);
  });

  it('GET /api/wines/:id – get by id', async () => {
    const res = await req('GET', `/api/wines/${createdId}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.id, createdId);
  });

  it('GET /api/wines/:id – 404 for unknown id', async () => {
    const res = await req('GET', '/api/wines/99999');
    assert.equal(res.status, 404);
  });

  it('PUT /api/wines/:id – update wine', async () => {
    const res = await req('PUT', `/api/wines/${createdId}`, {
      name: 'Aktualisierter Wein',
      type: 'Weißwein',
      quantity: 5,
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.name, 'Aktualisierter Wein');
    assert.equal(res.body.type, 'Weißwein');
  });

  it('PATCH /api/wines/:id/quantity – increment', async () => {
    const res = await req('PATCH', `/api/wines/${createdId}/quantity`, { delta: 2 });
    assert.equal(res.status, 200);
    assert.equal(res.body.quantity, 7);
  });

  it('PATCH /api/wines/:id/quantity – decrement, floor at 0', async () => {
    const res = await req('PATCH', `/api/wines/${createdId}/quantity`, { delta: -100 });
    assert.equal(res.status, 200);
    assert.equal(res.body.quantity, 0);
  });

  it('GET /api/wines?q= – search', async () => {
    await req('POST', '/api/wines', { name: 'Riesling Spätlese', grape: 'Riesling', type: 'Weißwein', quantity: 1 });
    const res = await req('GET', '/api/wines?q=riesling');
    assert.equal(res.status, 200);
    assert.ok(res.body.length >= 1);
    assert.ok(res.body.every(w => /riesling/i.test(w.name) || /riesling/i.test(w.grape || '')));
  });

  it('DELETE /api/wines/:id – delete wine', async () => {
    const res = await req('DELETE', `/api/wines/${createdId}`);
    assert.equal(res.status, 204);
  });

  it('DELETE /api/wines/:id – 404 after deletion', async () => {
    const res = await req('DELETE', `/api/wines/${createdId}`);
    assert.equal(res.status, 404);
  });
});
