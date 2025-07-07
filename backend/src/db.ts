import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();
let pool: Pool;

if (process.env.DATABASE_URL) {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
} else {
    pool = new Pool({
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT) || 5432,
        database: process.env.DATABASE_NAME,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD
    });
}

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Database connected! Server time:', res.rows[0].now);
    }
});
export default pool;
