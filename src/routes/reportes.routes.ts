import { Router } from 'express';
const router = Router();

import * as REPORTES from '../controllers/reportes.contoller';

// RUTAS DE REPORTES
router.get('/timbres', REPORTES.getInfoReporteTimbres);


export default router;