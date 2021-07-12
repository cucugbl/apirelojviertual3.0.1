import { Router } from 'express';
const router = Router();

import * as USUARIO from '../controllers/usuario.controller';
import * as EMPLEADO from '../controllers/empleados.controller';
import * as TIMBRES from '../controllers/timbre.controller';
import * as REPORTES from '../controllers/reportes.contoller';
import * as ROL from '../controllers/rol.controller';
import * as TIPO_TIMBRE from '../controllers/tipoTimbre.controller';
import { verificarToken } from '../autenticacion/verificarToken';

// RUTAS DE EMPLEADOS CONTROLADOR
router.get('/emple/lista', EMPLEADO.getListaEmpleados);
router.get('/empleados/horarios', EMPLEADO.getListaHorariosEmpleadoByCodigo);


// RUTAS DE REPORTES
router.get('/reporte/timbres', REPORTES.getInfoReporteTimbres);

router.get('/usuario', USUARIO.getUsers);
router.get('/usuario/:id', USUARIO.getUserById);
router.post('/loginUsuario', USUARIO.loginUsuario);
router.get('/usuarioId/:id', USUARIO.getUserByIdEmpresa);
router.get('/usuariosT/:id', USUARIO.getUserById);
// router.get('/usuarioEmpresa', verificarToken, USUARIO.getEmpleadosActivos);
// router.get('/usuarioA', USUARIO.getUserAdmin);
router.put('/actualizarIDcelular/:id_usuario', USUARIO.actualizarIDcelular);
router.post('/atraso/admin', USUARIO.justificarAtraso);

router.post('/timbre/admin', TIMBRES.crearTimbreJustificadoAdmin);
router.get('/timbreEmpleado/:idUsuario', TIMBRES.getTimbreById);
router.post('/timbre', TIMBRES.crearTimbre);


router.get('/tipoTimbre', TIPO_TIMBRE.getTipoTimbre);

router.get('/rol', ROL.getRoles);
export default router;