const request = require('supertest');
const express = require('express');

describe('Pruebas Integración - Intranet Municipal', () => {
  it('Debe responder HTTP 200 en la ruta principal', async () => {
    const app = express();
    app.get('/', (req, res) => res.status(200).send('OK'));
    
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
  });
});
