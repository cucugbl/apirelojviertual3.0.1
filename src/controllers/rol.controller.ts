import { Request, Response } from 'express';
import { pool } from '../database';
import { QueryResult } from 'pg';
import { Rol } from '../interfaces/Rol';


export const getRoles = async (req: Request, res: Response): Promise<Response> => {
    try {
        const response: QueryResult = await pool.query('SELECT * FROM rol');
        const roles: Rol[] = response.rows;
        return res.json(roles);
    } catch (error) {
        console.log(error);
        return res.status(500).json('Error al conectarse con la BDD');
    }
};