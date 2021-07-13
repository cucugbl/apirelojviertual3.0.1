import { Router } from 'express';
const router = Router();

import * as TIPO_TIMBRE from '../controllers/tipoTimbre.controller';

router.get('/', TIPO_TIMBRE.getTipoTimbre);

export default router;