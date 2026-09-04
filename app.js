const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Conexión a PostgreSQL en VLAN 30
const pool = new Pool({
    host: '192.168.30.10',
    port: 5432,
    user: 'intranet_user',
    password: 'adminIntraMuniusuari!',
    database: 'intranet_db'
});

// Vista HTML/JS incrustada
app.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM bienes_patrimoniales ORDER BY id DESC');
        let filas = result.rows.map(b => `
            <tr>
                <td>${b.codigo_patrimonial}</td>
                <td>${b.denominacion}</td>
                <td>${b.area_asignada}</td>
                <td>${b.responsable}</td>
                <td><span style="background:#e1f5fe;color:#0288d1;padding:3px 8px;border-radius:4px;">${b.estado}</span></td>
            </tr>
        `).join('');

        res.send(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>Intranet - Control Patrimonial</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 30px; background: #eceff1; }
                    .card { background: white; padding: 20px; border-radius: 8px; max-width: 900px; margin: auto; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                    h2 { color: #1565c0; margin-top: 0; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                    th { background-color: #1565c0; color: white; }
                    input, select { padding: 8px; margin: 5px; width: 30%; border: 1px solid #ccc; border-radius: 4px; }
                    button { background: #2e7d32; color: white; border: none; padding: 9px 15px; border-radius: 4px; cursor: pointer; }
                </style>
            </head>
            <body>
                <div class="card">
                    <h2>Intranet Municipal - Control Patrimonial</h2>
                    <form action="/bienes" method="POST">
                        <input type="text" name="codigo" placeholder="Cód. Patrimonial (Ej: PAT-2026-001)" required>
                        <input type="text" name="denominacion" placeholder="Descripción del Bien" required>
                        <input type="text" name="area" placeholder="Área / Gerencia" required>
                        <input type="text" name="responsable" placeholder="Servidor Responsable" required>
                        <select name="estado">
                            <option value="BUENO">BUENO</option>
                            <option value="REGULAR">REGULAR</option>
                            <option value="MALO">MALO</option>
                        </select>
                        <button type="submit">Registrar Activo</button>
                    </form>
                    <table>
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Denominación</th>
                                <th>Área</th>
                                <th>Responsable</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>${filas || '<tr><td colspan="5">No hay activos registrados.</td></tr>'}</tbody>
                    </table>
                </div>
            </body>
            </html>
        `);
    } catch (err) {
        res.status(500).send('Error conectando a la BD: ' + err.message);
    }
});

// Registrar nuevo activo
app.post('/bienes', async (req, res) => {
    const { codigo, denominacion, area, responsable, estado } = req.body;
    try {
        await pool.query(
            'INSERT INTO bienes_patrimoniales (codigo_patrimonial, denominacion, area_asignada, responsable, estado) VALUES ($1, $2, $3, $4, $5)',
            [codigo, denominacion, area, responsable, estado]
        );
        res.redirect('/');
    } catch (err) {
        res.send('Error al guardar registro: ' + err.message);
    }
});

app.listen(3000, '0.0.0.0', () => {
    console.log('Intranet patrimonial activa en puerto 3000');
});
