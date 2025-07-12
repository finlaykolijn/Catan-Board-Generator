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


app.listen(3001, () => {
  console.log('API running on http://localhost:3001')
})
