const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');
const characters = require('../data/characters.js');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

app.use('/auth', authRoutes);

app.use('/api', ensureAuth);

app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});

app.get('/characters', async(req, res) => {
  try {
    const data = await client.query('SELECT * from characters');
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/characters/:id', async (req, res) => {
  const id = Number(req.params.id);
  const character = characters.find((singleItem) => singleItem.id === id);
  res.json(character);
});

app.post('/characters', async(req, res) => {
  try {
    const data = await client.query(`
    INSERT INTO characters (name, cool_factor, category, owner_id)
      VALUES($1, $2, $3, 1)
      RETURNING *`, [req.body.name, req.body.cool_factor, req.body.category]);
    
    res.json(data.rows[0]);
  } catch (e) {
    res.json(500).json({ error: e.message });
  }
});

app.put('/characters/:id', async (req, res) => {
  try {
    const data = await client.query(`
    UPDATE characters
    SET
          name=$1,
          cool_factor=$2,
          category=$3
    WHERE id=$4
    RETURNING *
    `, [req.body.name, req.body.cool_factor, req.body.category, req.params.id]);

    res.json(data.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/characters/:id', async (req, res) => {
  try {
    const data = await client.query('DELETE FROM characters WHERE id=$1', [req.params.id]);
    res.json(data.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.use(require('./middleware/error'));

module.exports = app;
