"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
const USUARIO = __importStar(require("../controllers/usuario.controller"));
const EMPLEADO = __importStar(require("../controllers/empleados.controller"));
const EMPRESA = __importStar(require("../controllers/empresa.controller"));
const TIMBRES = __importStar(require("../controllers/timbre.controller"));
const REPORTES = __importStar(require("../controllers/reportes.contoller"));
const ROL = __importStar(require("../controllers/rol.controller"));
const TIPO_TIMBRE = __importStar(require("../controllers/tipoTimbre.controller"));
const verificarToken_1 = require("../autenticacion/verificarToken");
// RUTAS DE EMPLEADOS CONTROLADOR
router.get('/emple/lista', verificarToken_1.verificarToken, EMPLEADO.getListaEmpleados);
router.get('/empleados/horarios', verificarToken_1.verificarToken, EMPLEADO.getListaHorariosEmpleadoByCodigo);
// RUTAS DE REPORTES
router.get('/reporte/timbres', verificarToken_1.verificarToken, REPORTES.getInfoReporteTimbres);
router.get('/usuario', USUARIO.getUsers);
router.get('/usuario/:id', USUARIO.getUserById);
router.post('/loginUsuario', USUARIO.loginUsuario);
router.get('/usuarioEmpresa', verificarToken_1.verificarToken, USUARIO.getEmpleadosActivos);
router.get('/usuarioId/:id', USUARIO.getUserByIdEmpresa);
router.get('/usuariosT/:id', USUARIO.getUserById);
router.get('/usuarioA', USUARIO.getUserAdmin);
router.put('/actualizarIDcelular/:id_usuario', USUARIO.actualizarIDcelular);
router.post('/atraso/admin', USUARIO.justificarAtraso);
router.post('/timbre/admin', verificarToken_1.verificarToken, TIMBRES.crearTimbreJustificadoAdmin);
router.get('/timbreEmpleado/:idUsuario', verificarToken_1.verificarToken, TIMBRES.getTimbreById);
router.post('/timbre', verificarToken_1.verificarToken, TIMBRES.crearTimbre);
router.get('/tipoTimbre', verificarToken_1.verificarToken, TIPO_TIMBRE.getTipoTimbre);
router.get('/rol', verificarToken_1.verificarToken, ROL.getRoles);
router.get('/empresaId/:id', EMPRESA.getEmpresaPorId);
exports.default = router;
