import { Request, Response } from 'express';
import { pool } from '../database';
import { QueryResult } from 'pg';
import { Empleado } from '../interfaces/Empleados';
import { DetalleHorario, HorarioE } from '../interfaces/Horarios';


export const getListaEmpleados = async (req: Request, res: Response): Promise<Response> => {
    try {
        const response: QueryResult = await pool.query('SELECT id, cedula, codigo, (nombre || \' \' || apellido) as fullname FROM empleados ORDER BY fullname ASC');
        const empleados: Empleado[] = response.rows;
        console.log(empleados);
        
        return res.status(200).json(empleados);
    } catch (error) {
        console.log(error);
        return res.status(500).json('Error al conectarse con la BDD');
    }
};

export const getListaHorariosEmpleadoByCodigo = async (req: Request, res: Response): Promise<Response> => {
    try {
        const {codigo} = req.query;
        console.log(codigo);
        
        const response: QueryResult = await pool.query('SELECT id, codigo, CAST(fec_inicio AS VARCHAR), CAST(fec_final AS VARCHAR), lunes, martes, miercoles, jueves, viernes, sabado, domingo, id_horarios FROM empl_horarios WHERE codigo = $1', [codigo]); 
        const horarios: HorarioE[] = response.rows;

        if ( horarios.length === 0) return res.status(200).json([]);
        const deta_horarios = await Promise.all( horarios.map(async(o) => {
            const result: QueryResult = await pool.query('SELECT hora, minu_espera, orden, tipo_accion FROM deta_horarios WHERE id_horario = $1 ORDER BY orden ASC',[o.id_horarios])
            console.log(result.rows);
            o.detalle_horario = result.rows
            return o
        }))

        console.log(deta_horarios);
        
        return res.status(200).json(deta_horarios);
    } catch (error) {
        console.log(error);
        return res.status(500).json('Error al conectarse con la BDD');
    }
};