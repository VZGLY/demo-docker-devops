require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// GET toutes les personnes
app.get('/persons', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM person ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST nouvelle personne
app.post('/persons', async (req, res) => {
  const { nom } = req.body;
  if (!nom) return res.status(400).json({ error: 'nom requis' });
  try {
    const result = await pool.query('INSERT INTO person (nom) VALUES ($1) RETURNING *', [nom]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log(`http://localhost:3000`));
