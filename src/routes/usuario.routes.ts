import { Router } from 'express';
const router = Router();

import * as USUARIO from '../controllers/usuario.controller';

router.get('/usuario', USUARIO.getUsers);
router.get('/usuario/:id', USUARIO.getUserById);
router.post('/loginUsuario', USUARIO.loginUsuario);
router.get('/usuarioId/:id', USUARIO.getUserByIdEmpresa);
router.get('/usuariosT/:id', USUARIO.getUserById);
// router.get('/usuarioEmpresa', verificarToken, USUARIO.getEmpleadosActivos);
// router.get('/usuarioA', USUARIO.getUserAdmin);
router.put('/actualizarIDcelular/:id_usuario', USUARIO.actualizarIDcelular);
router.post('/atraso/admin', USUARIO.justificarAtraso);

export default router;