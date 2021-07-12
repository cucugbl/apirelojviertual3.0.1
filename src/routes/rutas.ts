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


router.get('/usuario', USUARIO.getUsers);
router.get('/usuario/:id', USUARIO.getUserById);
router.post('/loginUsuario', USUARIO.loginUsuario);
router.get('/usuarioEmpresa', verificarToken, USUARIO.getEmpleadosActivos);
router.get('/usuarioId/:id', USUARIO.getUserByIdEmpresa);
router.get('/usuariosT/:id', USUARIO.getUserById);
router.get('/usuarioA', USUARIO.getUserAdmin);
router.put('/actualizarIDcelular/:id_usuario', USUARIO.actualizarIDcelular);
router.post('/atraso/admin', USUARIO.justificarAtraso);




router.get('/empresaId/:id', EMPRESA.getEmpresaPorId);
router.get('/empresa/:id', EMPRESA.getEmpresaPorRuc);
router.put('/empresaT/:ruc_emp', EMPRESA.actualizarEmpresa);
router.put('/empresaF/:ruc_emp', verificarToken, EMPRESA.actualizarFechaFinEmpresa);
router.get('/empresaU', EMPRESA.getEmpresaUsuario);
router.get('/empresaE', EMPRESA.getempresa);




router.get('/timbre/:idEmpresa', verificarToken, TIMBRES.getTimbreByIdEmpresa);
router.post('/timbre/admin', verificarToken, TIMBRES.crearTimbreJustificadoAdmin);
router.post('/timbre', verificarToken, TIMBRES.crearTimbre);

router.get('/timbreEmpleado/:idUsuario', verificarToken, TIMBRES.getTimbreById);

router.get('/tipoTimbre', verificarToken, TIPO_TIMBRE.getTipoTimbre);

router.get('/rol', verificarToken, ROL.getRoles);



// RUTAS DE EMPLEADOS CONTROLADOR
router.get('/empleado/lista-empleados', verificarToken, EMPLEADO.getListaEmpleados);
router.get('/empleado/lista-horarios', verificarToken, EMPLEADO.getListaHorariosEmpleadoByCodigo);


// RUTAS DE REPORTES
router.get('/reporte/timbres', verificarToken, REPORTES.getListaEmpleados);


export default router;