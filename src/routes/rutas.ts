import { Router } from 'express';
const router = Router();

import * as USUARIO from '../controllers/usuario.controller';
import * as EMPLEADO from '../controllers/empleados.controller';
import * as EMPRESA from '../controllers/empresa.controller';
import * as TIMBRES from '../controllers/timbre.controller';
import * as REPORTES from '../controllers/reportes.contoller';
import * as ROL from '../controllers/rol.controller';
import * as TIPO_TIMBRE from '../controllers/tipoTimbre.controller';
import { verificarToken } from '../autenticacion/verificarToken';

// RUTAS DE EMPLEADOS CONTROLADOR
router.get('/emple/lista', verificarToken, EMPLEADO.getListaEmpleados);
router.get('/empleados/horarios', verificarToken, EMPLEADO.getListaHorariosEmpleadoByCodigo);


// RUTAS DE REPORTES
router.get('/reporte/timbres', verificarToken, REPORTES.getInfoReporteTimbres);

router.get('/usuario', USUARIO.getUsers);
router.get('/usuario/:id', USUARIO.getUserById);
router.post('/loginUsuario', USUARIO.loginUsuario);
router.get('/usuarioEmpresa', verificarToken, USUARIO.getEmpleadosActivos);
router.get('/usuarioId/:id', USUARIO.getUserByIdEmpresa);
router.get('/usuariosT/:id', USUARIO.getUserById);
router.get('/usuarioA', USUARIO.getUserAdmin);
router.put('/actualizarIDcelular/:id_usuario', USUARIO.actualizarIDcelular);
router.post('/atraso/admin', USUARIO.justificarAtraso);

router.post('/timbre/admin', verificarToken, TIMBRES.crearTimbreJustificadoAdmin);
router.get('/timbreEmpleado/:idUsuario', verificarToken, TIMBRES.getTimbreById);
router.post('/timbre', verificarToken, TIMBRES.crearTimbre);


router.get('/tipoTimbre', verificarToken, TIPO_TIMBRE.getTipoTimbre);

router.get('/rol', verificarToken, ROL.getRoles);

router.get('/empresaId/:id', EMPRESA.getEmpresaPorId);

export default router;