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
    //const result = await pool.query('SELECT id, board_name, board, created_at FROM public."base_catan_boards" ORDER BY created_at DESC')
    res.json(result.rows)

  } catch (err) {
    console.error("Query failed:", err)
    res.status(500).json({ error: err.message })
  }
})



app.put('/api/save-board', async (req, res) => {
  try {
    const { board, options, name, generatedAt, version } = req.body;
    
    // Validate required data
    if (!board || !board.hexes) {
      return res.status(400).json({ error: 'Invalid board data' });
    }

    // Use the provided name or create a default name if none provided
    const boardName = name && name.trim() ? name.trim() : `Catan Board - ${new Date(generatedAt).toLocaleString()}`;
    
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
      [boardName, boardData]
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

// Not currently used, could be useful later
// app.get('/api/get-board/:id', async (req, res) => {
//     try {
//       const { id } = req.params;
//       const result = await pool.query('SELECT * FROM public."base_catan_boards" WHERE id = $1', [id])
      
//       if (result.rows.length === 0) {
//         return res.status(404).json({ error: 'Board not found' });
//       }
      
//       res.json(result.rows[0])
  
//     } catch (err) {
//       console.error("Query failed:", err)
//       res.status(500).json({ error: err.message })
//     }
//   })