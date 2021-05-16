import { Router } from 'express';
const router = Router();

import { getUsers, getUserById,  getUserByEmpresa, loginUsuario,getUserByIdEmpresa,  getUserAdmin } from '../controllers/usuario.controller';
import { getEmpresaPorId, createEmpresa, getEmpresaPorRuc, actualizarEmpresa,actualizarFechaFinEmpresa, getEmpresaUsuario, getempresa, deleteEmpresa } from '../controllers/empresa.controller';
import { getTimbreById, crearTimbre, getTimbreByIdEmpresa } from '../controllers/timbre.controller';
import { getRoles } from '../controllers/rol.controller';
import { getTipoTimbre } from '../controllers/tipoTimbre.controller';
import { verificarToken } from '../autenticacion/verificarToken';


router.get('/usuario', getUsers);
router.get('/usuario/:id', getUserById);
router.post('/loginUsuario', loginUsuario);
router.get('/usuarioEmpresa/:id', verificarToken, getUserByEmpresa);
router.get('/usuarioId/:id', getUserByIdEmpresa);
router.get('/usuariosT/:id', getUserById);
router.get('/usuarioA', getUserAdmin);



router.get('/empresaId/:id', getEmpresaPorId);
router.get('/empresa/:id', getEmpresaPorRuc);
router.post('/empresa', createEmpresa);
router.put('/empresaT/:ruc_emp', actualizarEmpresa);
router.put('/empresaF/:ruc_emp',verificarToken, actualizarFechaFinEmpresa);
router.get('/empresaU', getEmpresaUsuario);
router.get('/empresaE', getempresa);




router.get('/timbre/:idEmpresa', verificarToken, getTimbreByIdEmpresa);
router.get('/timbreEmpleado/:idUsuario', verificarToken, getTimbreById);
router.post('/timbre', verificarToken, crearTimbre);

router.get('/rol', verificarToken, getRoles);

router.get('/tipoTimbre', verificarToken, getTipoTimbre);



export default router;