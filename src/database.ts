import { Pool } from 'pg';

export const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: 'postgres',
    database: 'FTW3.0',
    port: 5432
});