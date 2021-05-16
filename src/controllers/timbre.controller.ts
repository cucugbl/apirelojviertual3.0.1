import { Request, Response } from 'express';
import { pool } from '../database';
import { QueryResult } from 'pg';
import { Timbre } from '../interfaces/Timbre'


export const getTimbreByIdEmpresa = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = req.params.idEmpresa;
        const response: QueryResult = await pool.query('select timbre.id_usuario,tipo_timbre.descrip_tipo_timbre,tipo_timbre.id_tipo,nombre,usuario.apellido,fecha_timbre,hora_timbre,hora_timbre_app,observacion,latitud,longitud,timbre.tipo_identificacion,timbre.dispositivo_timbre,usuario.id_celular,timbre.tipo_autenticacion,timbre.dispositivo_timbre,timbre.fec_hora_timbre_servidor from timbre inner join usuario on timbre.id_usuario=usuario.id_usuario inner join tipo_timbre on timbre.id_tipo=tipo_timbre.id_tipo where id_empresa=$1 ORDER BY fecha_timbre DESC', [id]);
        const timbres: Timbre[] = response.rows;
        return res.status(200).json(timbres);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error al conectarse con la BDD');
    }
};


export const getTimbreById = async (req: Request, res: Response): Promise<Response> => {
    try {
        
        const id = parseInt(req.params.idUsuario);
        const response: QueryResult = await pool.query('SELECT * FROM timbres WHERE id_empleado = $1 ORDER BY fec_hora_timbre DESC', [id]);
        const timbres: Timbre[] = response.rows;
        return res.json(timbres);
    } catch (error) {
        console.log(error);
        return res.status(500).json('Error al conectarse con la BDD');
    }
};


export const crearTimbre = async (req: Request, res: Response) => {
    try {
        const hoy: Date = new Date();
        const fecha_timbre = new Date();
        const hora_timbre = hoy.getHours() + ":" + hoy.getMinutes();
        const timbre:Timbre = req.body;
        timbre.fec_hora_timbre_servidor=hoy.getDate()+"-"+(hoy.getMonth()+1)+"-"+hoy.getFullYear()+" "+hoy.getHours()+":"+hoy.getMinutes()+":"+hoy.getSeconds();
        const response = await pool.query('INSERT INTO timbres (fec_hora_timbre,accion,tecl_funcion,observacion,latitud,longitud,id_empleado,id_reloj,tipo_autenticacion,dispositivo_timbre,fec_hora_timbre_servidor) VALUES ($1,$2, $3, $4, $5, $6, $7, $8,$9, $10,$11);', [ timbre.fec_hora_timbre, timbre.accion, timbre.tecl_funcion, timbre.observacion, timbre.latitud, timbre.longitud,timbre.id_empleado,timbre.id_reloj,timbre.tipo_autenticacion,timbre.dispositivo_timbre,timbre.fec_hora_timbre_servidor]);
        
        
        res.json({ 
            message: 'Timbre creado con éxito'
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json('Error al crear usuario');
    }

};