import express from 'express'
import cors from 'cors'
import pg from 'pg'
import dotenv from 'dotenv'

// Load environment variables based on NODE_ENV
if (process.env.NODE_ENV === 'production') {
  // In production, only use DATABASE_URL
  dotenv.config()
} else {
  // In development, try to load from ../.env for Docker setup
  dotenv.config({path: "../.env"})
}

const app = express()
app.use(cors())
app.use(express.json())

// Debug: Log environment variables
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
if (process.env.DATABASE_URL) {
  const maskedUrl = process.env.DATABASE_URL.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
  console.log('Using DATABASE_URL:', maskedUrl);
} else {
  console.log('DATABASE_URL not found, using individual env vars');
  console.log('DB_HOST:', process.env.DB_HOST);
  console.log('DB_USER:', process.env.DB_USER);
  console.log('DB_NAME:', process.env.DB_NAME);
}

// Use DATABASE_URL from Supabase if available, otherwise fall back to individual env vars
const pool = new pg.Pool(
  process.env.DATABASE_URL 
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false } // Required for Supabase
      }
    : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASS,
        port: 5432
      }
)

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
    const { board, options, name, generatedAt, version, rating = 0 } = req.body;
    
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

    // Insert into database with rating
    const result = await pool.query(
      'INSERT INTO public."base_catan_boards" (board_name, board, rating) VALUES ($1, $2, $3) RETURNING *',
      [boardName, boardData, rating]
    );

    res.status(201).json({
      message: 'Board saved successfully',
      id: result.rows[0].id,
      boardName: result.rows[0].board_name,
      rating: result.rows[0].rating
    });

  } catch (err) {
    console.error("Query failed:", err)
    res.status(500).json({ error: err.message })
  }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`)
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