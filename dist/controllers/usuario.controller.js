"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.justificarAtraso = exports.actualizarIDcelular = exports.getUserByIdEmpresa = exports.loginUsuario = exports.getUserById = exports.getUsers = void 0;
const database_1 = require("../database");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const md5_typescript_1 = require("md5-typescript");
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield database_1.pool.query('SELECT * FROM usuarios ORDER BY usuario ASC');
        const usuarios = response.rows;
        return res.status(200).json(usuarios);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json('Error al conectarse con la BDD');
    }
});
exports.getUsers = getUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const response = yield database_1.pool.query("select * from usuarios where id=$1", [id]);
        const usuarios = response.rows;
        return res.json(usuarios[0]);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json('Error al conectarse con la BDD');
    }
});
exports.getUserById = getUserById;
const loginUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { usuario, contrasena } = req.body;
        const response = yield database_1.pool.query('select e.id AS id_registro_empleado, e.codigo as idEmpleado, e.cedula, e.apellido, e.nombre, e.esta_civil, e.genero, e.correo, e.fec_nacimiento, ' +
            'e.estado as eestado, e.mail_alternativo, e.domicilio, e.telefono, e.id_nacionalidad, e.imagen, e.codigo, e.latitud, ' +
            'e.longitud, u.id as id, u.usuario, u.contrasena, u.estado as estado, u.id_rol, u.id_empleado, u.app_habilita, ' +
            'u.longitud as uLongitud, u.latitud as uLatitud, frase, u.id_celular ' +
            'from usuarios as u inner join empleados as e on u.id_empleado = e.id WHERE usuario = $1;', [usuario]);
        const usuarios = response.rows;
        // console.log(usuarios);
        if (usuarios.length === 0)
            return res.status(401).json({
                message: 'No se encontro ningun usuario con ese nombre'
            });
        const { id_registro_empleado, eestado } = usuarios[0];
        if (eestado === 2)
            return res.status(401).json({
                message: 'Usuario desactivado del sistema'
            });
        const [data_empresa] = yield database_1.pool.query('SELECT c.id_departamento, c.id_sucursal, s.id_empresa, c.id AS id_cargo, cg_e.acciones_timbres, cg_e.public_key ' +
            'FROM empl_contratos AS e, empl_cargos AS c, sucursales AS s, cg_empresa AS cg_e WHERE e.id_empleado = $1 AND c.id_empl_contrato = e.id AND c.id_sucursal = s.id AND s.id_empresa = cg_e.id ORDER BY c.fec_inicio DESC LIMIT 1', [id_registro_empleado])
            .then(result => { return result.rows; });
        if (data_empresa === undefined)
            return res.status(401).json({
                message: 'El usuario no tiene informacion de contrato, cargo, sucursal o empresa valido.'
            });
        try {
            if (yield compararContraseña(contrasena, usuarios[0].contrasena)) {
                if (usuarios[0].app_habilita) {
                    const token = jsonwebtoken_1.default.sign({ _id: usuarios[0].usuario }, process.env.TOKEN_SECRETO || "masSeguridad");
                    usuarios[0].contrasena = '';
                    return res.status(200).json({
                        message: 'Usuario logeado con éxito',
                        body: {
                            autorizacion: token,
                            usuario: usuarios[0],
                            empresa: data_empresa
                        }
                    });
                }
                else {
                    delete usuarios[0];
                    return res.status(401).json({
                        message: 'Usuario inactivo para reloj virtual',
                        body: {
                            usuario: usuarios[0]
                        }
                    });
                }
            }
            else {
                delete usuarios[0];
                return res.status(401).json({
                    message: 'Usuario o contraseña es incorrecta',
                    body: {
                        usuario: usuarios[0]
                    }
                });
            }
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ message: 'No se encontro ningun usuario con ese nombre' });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json('Error al conectarse con la BDD');
    }
});
exports.loginUsuario = loginUsuario;
// export const getUserAdmin = async (req: Request, res: Response): Promise<Response> => {
//     try {
//         const response: QueryResult = await pool.query("SELECT *, CASE when user_estado = true THEN 'Activo' when user_estado = false THEN 'Inactivo' ELSE 'other' END FROM usuario WHERE id_rol = 0");
//         const empresa: Usuario[] = response.rows;
//         return res.json(empresa)
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json('Error al conectarse con la BDD')
//     }
// }
// export const getEmpleadosActivos = async (req: Request, res: Response): Promise<Response> => {
//     try {
//         const response: QueryResult = await pool.query('SELECT e.cedula, e.codigo, ( e.apellido || \' \' || e.nombre) as fullname, e.id, u.id_rol, u.usuario FROM empleados AS e, usuarios AS u WHERE e.id = u.id_empleado AND e.estado = 1 ORDER BY fullname');
//         const usuarios = response.rows;
//         console.log(usuarios);
//         return res.json(usuarios);
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json('Error al conectarse con la BDD');
//     }
// };
const getUserByIdEmpresa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const response = yield database_1.pool.query("SELECT *, CASE WHEN user_estado =true THEN 'Activo' WHEN user_estado =false THEN 'Inactivo' ELSE 'other'END FROM usuario WHERE id_empresa = $1 order by apellido", [id]);
        const usuarios = response.rows;
        return res.json(usuarios);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json('Error al conectarse con la BDD');
    }
});
exports.getUserByIdEmpresa = getUserByIdEmpresa;
const compararContraseña = function (contrasena_ingresada, contrasena_bdd) {
    return __awaiter(this, void 0, void 0, function* () {
        if (md5_typescript_1.Md5.init(contrasena_ingresada) === contrasena_bdd) {
            return true;
        }
        else {
            return false;
        }
    });
};
const actualizarIDcelular = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id_usuario = (req.params.id_usuario);
        const { id_celular } = req.body;
        console.log(id_celular, id_usuario);
        const response = yield database_1.pool.query('UPDATE usuario SET id_celular = $1 WHERE id = $2', [id_celular, id_usuario]);
        res.status(200).json({
            body: {
                mensaje: "ID celular actualizado",
                response: response.rowCount
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json('Error al actualizar ID celular');
    }
});
exports.actualizarIDcelular = actualizarIDcelular;
const justificarAtraso = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { descripcion, fec_justifica, codigo, codigo_create_user } = req.body;
        const create_time = new Date();
        console.log(req.body);
        const response = yield database_1.pool.query('INSERT INTO atrasos(descripcion, fec_justifica, codigo, create_time, codigo_create_user) VALUES($1, $2, $3, $4, $5) RETURNING id', [descripcion, fec_justifica, codigo, create_time, codigo_create_user]);
        if (response.rowCount === 0)
            return res.status(400).jsonp({ message: 'Registro no insertado' });
        return res.status(200).json({
            body: {
                mensaje: "Atraso justificado",
                response: response.rows
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json('Error al crear justificación');
    }
});
exports.justificarAtraso = justificarAtraso;
