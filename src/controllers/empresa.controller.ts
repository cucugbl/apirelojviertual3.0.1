import { Request, Response } from 'express';
import { pool } from '../database';
import { QueryResult } from 'pg';
import { Empresa } from '../interfaces/Empresa'
import jwt from 'jsonwebtoken';

export const getEmpresaPorId = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = parseInt(req.params.id);
        const response: QueryResult = await pool.query('SELECT * FROM empresa WHERE id_empresa = $1', [id]);
        const empresa: Empresa[] = response.rows;
        return res.json(empresa[0]);
    } catch (error) {
        console.log(error);
        return res.status(500).json('Error al conectarse con la BDD');
    }
};




export const getEmpresaPorRuc = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = parseInt(req.params.id);
        const response: QueryResult = await pool.query('SELECT * FROM empresa WHERE ruc_emp = $1', [id]);
        const empresa: Empresa[] = response.rows;
        return res.json(empresa[0]);
    } catch (error) {
        console.log(error);
        return res.status(500).json('Error al conectarse con la BDD');
    }
};



export const createEmpresa = async (req: Request, res: Response) => {
    try {
        const hoy:Date= new Date();  
        const fecha_inicial_perido=new Date();
        const fecha_fina_periodo=new Date( hoy.setDate(hoy.getDate()+5))
        const empresa:Empresa = req.body
        const response: QueryResult= await pool.query('INSERT INTO public.empresa(ruc_emp, nombre_emp, hash, provincia, ciudad,fecha_inicial_perido, fecha_fina_periodo,estado_empresa) VALUES ( $1, $2, $3, $4, $5,$6,$7,true) returning id_empresa;', [empresa.ruc_emp, empresa.nombre_emp, empresa.hash, empresa.provincia, empresa.ciudad,fecha_inicial_perido, fecha_fina_periodo]);
        res.status(200).json(response.rows[0])

    } catch (error) {
        console.log(error);
        return res.status(500).json('Error al crear empresa');
    }

};


export const actualizarEmpresa = async (req: Request, res: Response) => {
    const  ruc= (req.params.ruc_emp);
    const { nombre_emp, hash, provincia, ciudad,fechaI,fechaF,estado_empresa, fechaactualizacionlicencia} = req.body;

    pool.query(
        'UPDATE empresa SET nombre_emp = $1, hash = $2, provincia = $3, ciudad = $4, fecha_inicial_perido = $5, fecha_fina_periodo = $6, estado_empresa = $7, fechaactualizacionlicencia = $8  WHERE ruc_emp = $9',
    [nombre_emp, hash, provincia, ciudad, fechaI, fechaF,estado_empresa,fechaactualizacionlicencia, ruc],
    (error, results) => {
      if (error) {
        throw error
      }
      res.json(`EMPRESA con ruc ${ruc} actualizado correctamente `);

    }
    )
};

export const actualizarFechaFinEmpresa= async (req: Request, res: Response) => {
    const  ruc= (req.params.ruc_emp);
    const { fecha} = req.body;

    pool.query(
        'UPDATE empresa SET fecha_fina_periodo = $1  WHERE ruc_emp = $2',
    [fecha, ruc],
    (error, results) => {
      if (error) {
        throw error
      }
      res.json(`Empresa con ruc: ${ruc} actualizado correctamente, el fecha de fin se cambio a ${fecha} `);

    }
    )
};

export const verificarLicenciaBDD = async () => {
    try {
        const response: QueryResult= await pool.query('select comprobarLicencia()');
        console.log(response.rows[0])
       
    } catch (error) {
        console.log(error);
        
    }

};

export const getEmpresaUsuario = async (req: Request, res: Response): Promise<Response> => {
    try {
        //const response: QueryResult = await pool.query('SELECT * FROM empresa INNER JOIN usuario ON empresa.id_empresa = usuario.id_empresa;');
        const response: QueryResult = await pool.query('SELECT ruc_emp,nombre_emp,nombre,apellido FROM empresa INNER JOIN usuario ON empresa.id_empresa = usuario.id_empresa GROUP BY nombre_emp,ruc_emp,nombre,apellido;');
        const empresas: Empresa[] = response.rows;
        return res.json(empresas);
    } catch (error) {
        console.log(error);
        return res.status(500).json('Error al conectarse con la BDD');
    }
};

export const getempresa = async ( req: Request, res: Response ): Promise<Response> => {
    try{
        const response: QueryResult = await pool.query("select *,CASE WHEN estado_empresa =true THEN 'Activo' WHEN estado_empresa =false THEN 'Inactivo' ELSE 'other'END from empresa where id_empresa <> 181 order by nombre_emp");
        const empresa: Empresa[] = response.rows;
        return res.json(empresa)
        

    }catch(error){
        console.log(error);
        return res.status(500).json('Error al conectarse con la BDD')

    }
}

export const deleteEmpresa = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    await pool.query('DELETE FROM empresa where id_empresa = $1', [
        id
    ]);
    res.json(`Empresa ${id} deleted Successfully`);
};