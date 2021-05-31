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
exports.getUserByIdEmpresa = exports.getUserByEmpresa = exports.getUserAdmin = exports.loginUsuario = exports.getUserById = exports.getUsers = void 0;
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
        const { usuario, contrasena, user_estado } = req.body;
        const response = yield database_1.pool.query('select empleados.id as idEmpleado, cedula, apellido,nombre,esta_civil,genero,correo,fec_nacimiento,empleados.estado as eestado,mail_alternativo,domicilio,telefono,id_nacionalidad,imagen,codigo,empleados.latitud,empleados.longitud,usuarios.id as id, usuario, contrasena,usuarios.estado as estado,id_rol,id_empleado,app_habilita,usuarios.longitud as uLongitud, usuarios.latitud as uLatitud, frase from usuarios inner join empleados on usuarios.id_empleado=empleados.id WHERE usuario=$1;', [usuario]);
        const usuarios = response.rows;
        try {
            if (yield compararContraseña(contrasena, usuarios[0].contrasena)) {
                if (usuarios[0].app_habilita) {
                    const token = jsonwebtoken_1.default.sign({ _id: usuarios[0].usuario }, process.env.TOKEN_SECRETO || "masSeguridad");
                    usuarios[0].contrasena = '';
                    return res.status(200).json({
                        message: 'Usuario logeado con éxito',
                        body: {
                            autorizacion: token,
                            usuario: usuarios[0]
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
                    message: 'La contraseña es incorrecta',
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
const getUserAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield database_1.pool.query("SELECT *, CASE when user_estado = true THEN 'Activo' when user_estado = false THEN 'Inactivo' ELSE 'other' END FROM usuario WHERE id_rol = 0");
        const empresa = response.rows;
        return res.json(empresa);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json('Error al conectarse con la BDD');
    }
});
exports.getUserAdmin = getUserAdmin;
const getUserByEmpresa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const response = yield database_1.pool.query('SELECT id_rol,nombre,apellido,user_name,user_estado FROM usuario WHERE id_empresa = $1', [id]);
        const usuarios = response.rows;
        return res.json(usuarios);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json('Error al conectarse con la BDD');
    }
});
exports.getUserByEmpresa = getUserByEmpresa;
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
