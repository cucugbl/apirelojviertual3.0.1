import { Pool } from 'pg';

export const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: 'postgres',
    database: 'FTW3.0',
    port: 5432
});

pool.query('Select now()', (err, res) => {
    if (err) {
        console.log('Error durante la conexion', err);
    } else {
        console.log('Conexion exitosa BDD');
    }
})