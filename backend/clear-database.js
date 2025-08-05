import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config({path: "../.env"})

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432
})

async function clearDatabase() {
  try {
    console.log('Connecting to database...')
    
    // Delete all entries from the base_catan_boards table
    const result = await pool.query('DELETE FROM public."base_catan_boards"')
    
    console.log(`Successfully deleted ${result.rowCount} entries from the database.`)
    
    // Reset the sequence to start from 1 again
    await pool.query('ALTER SEQUENCE public.base_catan_boards_id_seq RESTART WITH 1')
    console.log('Reset the ID sequence to start from 1.')
    
  } catch (err) {
    console.error('Error clearing database:', err)
    process.exit(1)
  } finally {
    await pool.end()
    console.log('Database connection closed.')
  }
}

// Run the script
clearDatabase() 