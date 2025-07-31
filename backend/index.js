import express from 'express'
import cors from 'cors'
import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config({path: "../.env"})

const app = express()
app.use(cors())
app.use(express.json())

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432
})

app.get('/api/get-boards', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public."base_catan_boards"')
    res.json(result.rows)

  } catch (err) {
    console.error("Query failed:", err)
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/save-board', async (req, res) => {
  try {
    const { board, options, generatedAt, version } = req.body;
    
    // Validate required data
    if (!board || !board.hexes) {
      return res.status(400).json({ error: 'Invalid board data' });
    }

    // Create a board name based on timestamp and options
    const boardName = `Catan Board - ${new Date(generatedAt).toLocaleString()}`;
    
    // Prepare the data to store
    const boardData = {
      board: board,
      options: options,
      generatedAt: generatedAt,
      version: version
    };

    // Insert into database
    const result = await pool.query(
      'INSERT INTO public."base_catan_boards" (board_name, board) VALUES ($1, $2) RETURNING *',
      [boardName, JSON.stringify(boardData)]
    );

    res.status(201).json({
      message: 'Board saved successfully',
      id: result.rows[0].id,
      boardName: result.rows[0].board_name
    });

  } catch (err) {
    console.error("Query failed:", err)
    res.status(500).json({ error: err.message })
  }
});


app.listen(3001, () => {
  console.log('API running on http://localhost:3001')
})

