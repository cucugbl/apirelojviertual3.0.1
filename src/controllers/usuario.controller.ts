import { Request, Response } from 'express';
import { pool } from '../database';
import { QueryResult } from 'pg';
import { Usuario } from '../interfaces/Usuario'
import jwt from 'jsonwebtoken';
import {Md5} from "md5-typescript";
 


export const getUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
        const response: QueryResult = await
            pool.query('SELECT * FROM usuarios ORDER BY usuario ASC');
        const usuarios: Usuario[] = response.rows;
        return res.status(200).json(usuarios);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error al conectarse con la BDD');
    }
};
export const getUserById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = parseInt(req.params.id);
        const response: QueryResult = await pool.query("select * from usuarios where id=$1", [id]);
        const usuarios: Usuario[] = response.rows;
        return res.json(usuarios[0]);
    } catch (error) {
        console.log(error);
        return res.status(500).json('Error al conectarse con la BDD');
    }
};

export const loginUsuario = async (req: Request, res: Response) => {
    try {
        const { usuario, contrasena, user_estado } = req.body;

        const response = await pool.query('select empleados.codigo as idEmpleado, cedula, apellido,nombre,esta_civil,genero,correo,fec_nacimiento,empleados.estado as eestado,mail_alternativo,domicilio,telefono,id_nacionalidad,imagen,codigo,empleados.latitud,empleados.longitud,usuarios.id as id, usuario, contrasena,usuarios.estado as estado,id_rol,id_empleado,app_habilita,usuarios.longitud as uLongitud, usuarios.latitud as uLatitud, frase from usuarios inner join empleados on usuarios.id_empleado=empleados.id WHERE usuario=$1;', [usuario]);
        const usuarios: Usuario[] = response.rows;
        try {
            
            if (await compararContraseña(contrasena, usuarios[0].contrasena)) {
                if(usuarios[0].app_habilita){
                    const token: string = jwt.sign({ _id: usuarios[0].usuario }, process.env.TOKEN_SECRETO || "masSeguridad")
                    usuarios[0].contrasena='';
                    return res.status(200).json({
                        message: 'Usuario logeado con éxito',
                        body: {
                            autorizacion: token,
                            usuario: usuarios[0]
                        }
                    })
                }else{
                    delete usuarios[0]
                    return res.status(401).json({
                        message: 'Usuario inactivo para reloj virtual',
                        body: {
                            usuario: usuarios[0]
                        }
                    })
                }
              
            } else {
                delete usuarios[0]
                return res.status(401).json({
                    message: 'La contraseña es incorrecta',
                    body: {
                        usuario: usuarios[0]
                    }
                })
            }
        } catch (error) {
            console.log(error);
            return res.status(401).json({ message: 'No se encontro ningun usuario con ese nombre' });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json('Error al conectarse con la BDD');
    }

};


export const getUserAdmin = async (req: Request, res: Response): Promise<Response> => {
    try {
        const response: QueryResult = await pool.query("SELECT *, CASE when user_estado = true THEN 'Activo' when user_estado = false THEN 'Inactivo' ELSE 'other' END FROM usuario WHERE id_rol = 0");
        const empresa: Usuario[] = response.rows;
        return res.json(empresa)


    } catch (error) {
        console.log(error);
        return res.status(500).json('Error al conectarse con la BDD')

    }
}

export const getUserByEmpresa = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = parseInt(req.params.id);
        const response: QueryResult = await pool.query('SELECT id_rol,nombre,apellido,user_name,user_estado FROM usuario WHERE id_empresa = $1', [id]);
        const usuarios: Usuario[] = response.rows;
        return res.json(usuarios);
    } catch (error) {
        console.log(error);
        return res.status(500).json('Error al conectarse con la BDD');
    }
};


export const getUserByIdEmpresa = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = parseInt(req.params.id);
        const response: QueryResult = await pool.query("SELECT *, CASE WHEN user_estado =true THEN 'Activo' WHEN user_estado =false THEN 'Inactivo' ELSE 'other'END FROM usuario WHERE id_empresa = $1 order by apellido", [id]);
        const usuarios: Usuario[] = response.rows;
        return res.json(usuarios);
    } catch (error) {
        console.log(error);
        return res.status(500).json('Error al conectarse con la BDD');
    }
};




const compararContraseña = async function (contrasena_ingresada: string, contrasena_bdd: string): Promise<boolean> {
    if(Md5.init(contrasena_ingresada)===contrasena_bdd){
        return  true;
    }else{
        return  false;
    }

    
};













