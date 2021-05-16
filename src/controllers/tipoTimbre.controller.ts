import { Request, Response } from 'express';
import { pool } from '../database';
import { QueryResult } from 'pg';
import { TipoTimbre } from '../interfaces/TipoTimbre';


export const getTipoTimbre = async (req: Request, res: Response): Promise<Response> => {
    try {
        const response: QueryResult = await pool.query('SELECT * FROM tipo_timbre');
        const TipoTimbre: TipoTimbre[] = response.rows;
        return res.json(TipoTimbre);
    } catch (error) {
        console.log(error);
        return res.status(500).json('Error al conectarse con la BDD');
    }
};