import express from 'express'
import cors from 'cors'
import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: 'localhost',
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432
})

app.get('/api/get-boards', async (req, res) => {
  const result = await pool.query('SELECT * FROM base-catan-boards')
  res.json(result.rows)
})

app.listen(3001, () => {
  console.log('API running on http://localhost:3001')
})
