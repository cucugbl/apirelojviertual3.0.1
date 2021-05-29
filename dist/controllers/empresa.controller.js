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
exports.deleteEmpresa = exports.getempresa = exports.getempresausuario = exports.verificarLicenciaBDD = exports.actualizarFechaFinEmpresa = exports.actualizarEmpresa = exports.createEmpresa = exports.getEmpresaPorRuc = exports.getEmpresaPorId = void 0;
const database_1 = require("../database");
const getEmpresaPorId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const response = yield database_1.pool.query('SELECT * FROM empresa WHERE id_empresa = $1', [id]);
        const empresa = response.rows;
        return res.json(empresa[0]);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json('Error al conectarse con la BDD');
    }
});
exports.getEmpresaPorId = getEmpresaPorId;
const getEmpresaPorRuc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const response = yield database_1.pool.query('SELECT * FROM empresa WHERE ruc_emp = $1', [id]);
        const empresa = response.rows;
        return res.json(empresa[0]);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json('Error al conectarse con la BDD');
    }
});
exports.getEmpresaPorRuc = getEmpresaPorRuc;
const createEmpresa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hoy = new Date();
        const fecha_inicial_perido = new Date();
        const fecha_fina_periodo = new Date(hoy.setDate(hoy.getDate() + 5));
        const empresa = req.body;
        const response = yield database_1.pool.query('INSERT INTO public.empresa(ruc_emp, nombre_emp, hash, provincia, ciudad,fecha_inicial_perido, fecha_fina_periodo,estado_empresa) VALUES ( $1, $2, $3, $4, $5,$6,$7,true) returning id_empresa;', [empresa.ruc_emp, empresa.nombre_emp, empresa.hash, empresa.provincia, empresa.ciudad, fecha_inicial_perido, fecha_fina_periodo]);
        res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json('Error al crear empresa');
    }
});
exports.createEmpresa = createEmpresa;
const actualizarEmpresa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ruc = (req.params.ruc_emp);
    const { nombre_emp, hash, provincia, ciudad, fechaI, fechaF, estado_empresa, fechaactualizacionlicencia } = req.body;
    database_1.pool.query('UPDATE empresa SET nombre_emp = $1, hash = $2, provincia = $3, ciudad = $4, fecha_inicial_perido = $5, fecha_fina_periodo = $6, estado_empresa = $7, fechaactualizacionlicencia = $8  WHERE ruc_emp = $9', [nombre_emp, hash, provincia, ciudad, fechaI, fechaF, estado_empresa, fechaactualizacionlicencia, ruc], (error, results) => {
        if (error) {
            throw error;
        }
        res.json(`EMPRESA con ruc ${ruc} actualizado correctamente `);
    });
});
exports.actualizarEmpresa = actualizarEmpresa;
const actualizarFechaFinEmpresa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ruc = (req.params.ruc_emp);
    const { fecha } = req.body;
    database_1.pool.query('UPDATE empresa SET fecha_fina_periodo = $1  WHERE ruc_emp = $2', [fecha, ruc], (error, results) => {
        if (error) {
            throw error;
        }
        res.json(`Empresa con ruc: ${ruc} actualizado correctamente, el fecha de fin se cambio a ${fecha} `);
    });
});
exports.actualizarFechaFinEmpresa = actualizarFechaFinEmpresa;
const verificarLicenciaBDD = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield database_1.pool.query('select comprobarLicencia()');
        console.log(response.rows[0]);
    }
    catch (error) {
        console.log(error);
    }
});
exports.verificarLicenciaBDD = verificarLicenciaBDD;
const getempresausuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //const response: QueryResult = await pool.query('SELECT * FROM empresa INNER JOIN usuario ON empresa.id_empresa = usuario.id_empresa;');
        const response = yield database_1.pool.query('SELECT ruc_emp,nombre_emp,nombre,apellido FROM empresa INNER JOIN usuario ON empresa.id_empresa = usuario.id_empresa GROUP BY nombre_emp,ruc_emp,nombre,apellido;');
        const empresas = response.rows;
        return res.json(empresas);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json('Error al conectarse con la BDD');
    }
});
exports.getempresausuario = getempresausuario;
const getempresa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield database_1.pool.query("select *,CASE WHEN estado_empresa =true THEN 'Activo' WHEN estado_empresa =false THEN 'Inactivo' ELSE 'other'END from empresa where id_empresa <> 181 order by nombre_emp");
        const empresa = response.rows;
        return res.json(empresa);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json('Error al conectarse con la BDD');
    }
});
exports.getempresa = getempresa;
const deleteEmpresa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    yield database_1.pool.query('DELETE FROM empresa where id_empresa = $1', [
        id
    ]);
    res.json(`Empresa ${id} deleted Successfully`);
});
exports.deleteEmpresa = deleteEmpresa;