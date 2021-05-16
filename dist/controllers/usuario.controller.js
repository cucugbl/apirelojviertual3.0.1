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
exports.deleteUser = exports.actualizarIDcelular = exports.actualizarContrasena = exports.actualizarUserAdmin = exports.createUserAdministrador = exports.createUserAdmin = exports.createUser = exports.getUserByIdEmpresa = exports.getUserByEmpresa = exports.getUserAdmin = exports.getUserById = exports.getUsers = void 0;
const database_1 = require("../database");
const bcrypt_nodejs_1 = __importDefault(require("bcrypt-nodejs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield database_1.pool.query('SELECT * FROM usuario ORDER BY apellido ASC');
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
        const response = yield database_1.pool.query("SELECT * ,CASE WHEN user_estado =true THEN 'Activo' WHEN user_estado =false THEN 'Inactivo' ELSE 'other'END FROM usuario WHERE id_usuario = $1", [id]);
        const usuarios = response.rows;
        return res.json(usuarios[0]);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json('Error al conectarse con la BDD');
    }
});
exports.getUserById = getUserById;
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
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usuario = req.body; //enciptando password
        const contraseñaEncriptada = yield encriptarContraseña(usuario.user_password);
        //insersion en la BDD
        const response = yield database_1.pool.query('INSERT INTO usuario (id_empresa, id_rol, nombre, apellido, cedula, user_name, user_password, user_estado,id_celular) VALUES ($1,$2, $3, $4, $5, $6, $7,true,$8) returning id_usuario;', [usuario.id_empresa, usuario.id_rol, usuario.nombre, usuario.apellido, usuario.cedula, usuario.user_name, contraseñaEncriptada, usuario.id_celular]);
        //CREANDO TOKEN DE USUARIO
        const token = jsonwebtoken_1.default.sign({ _id: usuario.cedula }, process.env.TOKEN_SECRETO || "masSeguridad");
        res.json({
            body: {
                autorizacion: token,
                id_usuario: response.rows[0]
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json('Error al crear usuario');
    }
});
exports.createUser = createUser;
const createUserAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usuario = req.body;
        const contraseñaEncriptada = yield encriptarContraseña(usuario.user_password);
        //insersion en la BDD
        const response = yield database_1.pool.query("INSERT INTO usuario (id_empresa, id_rol, nombre, apellido, cedula, user_name, user_password, user_estado) VALUES (119,0, 'admin', 'admin', '1111111111', $1,$2,true) returning id_usuario;", [usuario.user_name, contraseñaEncriptada]);
        //CREANDO TOKEN DE USUARIO
        const token = jsonwebtoken_1.default.sign({ _id: usuario.cedula }, process.env.TOKEN_SECRETO || "masSeguridad");
        res.json({
            body: {
                autorizacion: token,
                id_usuario: response.rows[0]
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json('Error al crear usuario');
    }
});
exports.createUserAdmin = createUserAdmin;
const createUserAdministrador = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usuario = req.body;
        const { user_name, password } = req.body;
        const contraseñaEncriptada = yield encriptarContraseña(password);
        //insersion en la BDD
        const response = yield database_1.pool.query("INSERT INTO usuario (id_empresa, id_rol, nombre, apellido, cedula, user_name, user_password, user_estado) VALUES (119,0, 'admin', 'admin', '1111111111', $1,$2,true);", [user_name, contraseñaEncriptada]);
        const token = jsonwebtoken_1.default.sign({ _id: usuario.cedula }, process.env.TOKEN_SECRETO || "masSeguridad");
        res.json({
            body: {
                autorizacion: token,
                id_usuario: response.rows[0]
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json('Error al crear usuario');
    }
});
exports.createUserAdministrador = createUserAdministrador;
const encriptarContraseña = (user_password) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = bcrypt_nodejs_1.default.genSaltSync(10);
    return bcrypt_nodejs_1.default.hashSync(user_password, salt);
});
const compararContraseña = function (user_password, usuario_encriptado) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_nodejs_1.default.compareSync(user_password, usuario_encriptado);
    });
};
const actualizarUserAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = (req.params.id_usuario);
    const { user_password } = req.body;
    const contraseñaEncriptada = yield encriptarContraseña(user_password);
    database_1.pool.query('UPDATE usuario SET user_password= $1  WHERE id_usuario = $2', [contraseñaEncriptada, id], (error, results) => {
        if (error) {
            throw error;
        }
        res.json(`Usuario ${id} actualizado correctamente `);
    });
});
exports.actualizarUserAdmin = actualizarUserAdmin;
const actualizarContrasena = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = (req.params.user_name);
        const { user_password, user_name, nombre, apellido, user_estado, id_rol } = req.body;
        const contraseñaEncriptada = yield encriptarContraseña(user_password);
        database_1.pool.query('UPDATE usuario SET user_password = $1, nombre = $3, apellido = $4, user_estado = $5, id_rol=$6 WHERE user_name = $2', [contraseñaEncriptada, user_name, nombre, apellido, user_estado, id_rol], (error, results) => {
            if (error) {
                throw error;
            }
            res.json(`Contraseña de usuario: ${id} actualizado correctamente`);
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json('Error al actualizar contraseña');
    }
});
exports.actualizarContrasena = actualizarContrasena;
const actualizarIDcelular = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id_usuario = (req.params.id_usuario);
        const { id_celular } = req.body;
        console.log(id_celular);
        const response = yield database_1.pool.query('UPDATE usuario SET id_celular = $1 WHERE id_usuario = $2', [id_celular, id_usuario]);
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
/*export const updateUser = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { name, email } = req.body;

    const response = await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3', [
        name,
        email,
        id
    ]);
    res.json('User Updated Successfully');
};
*/
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    yield database_1.pool.query('DELETE FROM public.usuario where usuario.id_usuario = $1', [
        id
    ]);
    res.json(`User ${id} deleted Successfully`);
});
exports.deleteUser = deleteUser;
