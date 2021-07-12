import { Request, Response } from 'express';
import { pool } from '../database';
import { QueryResult } from 'pg';
import { Timbre } from '../interfaces/Timbre';


export const getInfoReporteTimbres = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { codigo, fec_inicio, fec_final } = req.query;
        const response: QueryResult = await pool.query('SELECT * FROM timbres WHERE id_empleado = $3 AND fec_hora_timbre BETWEEN $1 AND $2 ORDER BY fec_hora_timbre ASC', [fec_inicio, fec_final, codigo]);
        const timbres: Timbre[] = response.rows;
        // console.log(timbres);
        if (timbres.length === 0) return res.status(400).jsonp({ message: 'No hay timbres resgistrados' })

        return res.status(200).json(timbres);
    } catch (error) {
        console.log(error);
        return res.status(500).json('Error al conectarse con la BDD');
    }
};
