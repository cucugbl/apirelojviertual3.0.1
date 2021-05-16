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
Object.defineProperty(exports, "__esModule", { value: true });
exports.crearTimbre = exports.getTimbreById = exports.getTimbreByIdEmpresa = void 0;
const database_1 = require("../database");
const getTimbreByIdEmpresa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.idEmpresa;
        const response = yield database_1.pool.query('select timbre.id_usuario,tipo_timbre.descrip_tipo_timbre,tipo_timbre.id_tipo,nombre,usuario.apellido,fecha_timbre,hora_timbre,hora_timbre_app,observacion,latitud,longitud,timbre.tipo_identificacion,timbre.dispositivo_timbre,usuario.id_celular from timbre inner join usuario on timbre.id_usuario=usuario.id_usuario inner join tipo_timbre on timbre.id_tipo=tipo_timbre.id_tipo where id_empresa=$1 ORDER BY fecha_timbre DESC', [id]);
        const timbres = response.rows;
        return res.status(200).json(timbres);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json('Error al conectarse con la BDD');
    }
});
exports.getTimbreByIdEmpresa = getTimbreByIdEmpresa;
const getTimbreById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.idUsuario);
        const response = yield database_1.pool.query('SELECT * FROM timbre WHERE id_usuario = $1 ORDER BY fecha_timbre DESC', [id]);
        const timbres = response.rows;
        return res.json(timbres);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json('Error al conectarse con la BDD');
    }
});
exports.getTimbreById = getTimbreById;
const crearTimbre = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hoy = new Date();
        const fecha_timbre = new Date();
        const hora_timbre = hoy.getHours() + ":" + hoy.getMinutes();
        const timbre = req.body;
        const response = yield database_1.pool.query('INSERT INTO timbre (id_tipo,id_usuario,fecha_timbre_app,fecha_timbre,hora_timbre,hora_timbre_app,observacion,latitud,longitud,dispositivo_timbre,tipo_identificacion) VALUES ($1,$2, $3, $4, $5, $6, $7, $8,$9 ,$10,$11);', [timbre.id_tipo, timbre.id_usuario, timbre.fecha_timbre_app, fecha_timbre, hora_timbre, timbre.hora_timbre_app, timbre.observacion, timbre.latitud, timbre.longitud, timbre.dispositivo_timbre, timbre.tipo_identificacion]);
        res.json({
            message: 'Timbre creado con éxito'
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json('Error al crear usuario');
    }
});
exports.crearTimbre = crearTimbre;
