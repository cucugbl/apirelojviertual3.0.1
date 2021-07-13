import { Router } from 'express';
const router = Router();

import * as TIMBRES from '../controllers/timbre.controller';

router.post('/timbre/admin', TIMBRES.crearTimbreJustificadoAdmin);
router.get('/timbreEmpleado/:idUsuario', TIMBRES.getTimbreById);
router.post('/timbre', TIMBRES.crearTimbre);

export default router;