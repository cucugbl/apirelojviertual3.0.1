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
exports.getListaEmpleados = void 0;
const database_1 = require("../database");
const getListaEmpleados = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { codigo, fec_inicio, fec_final } = req.query;
        const response = yield database_1.pool.query('SELECT * FROM timbres WHERE id_empleado = $3 AND fec_hora_timbre BETWEEN $1 AND $2 ORDER BY fec_hora_timbre ASC', [fec_inicio, fec_final, codigo]);
        const timbres = response.rows;
        // console.log(timbres);
        if (timbres.length === 0)
            return res.status(400).jsonp({ message: 'No hay timbres resgistrados' });
        return res.status(200).json(timbres);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json('Error al conectarse con la BDD');
    }
});
exports.getListaEmpleados = getListaEmpleados;
