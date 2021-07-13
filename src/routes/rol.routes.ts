import { Router } from 'express';
const router = Router();

import * as ROL from '../controllers/rol.controller';

router.get('/rol', ROL.getRoles);


export default router;