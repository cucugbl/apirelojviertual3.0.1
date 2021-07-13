import { Router } from 'express';
const router = Router();

import * as EMPLEADO from '../controllers/empleados.controller';

// RUTAS DE EMPLEADOS CONTROLADOR
router.get('/lista', EMPLEADO.getListaEmpleados);
router.get('/horarios', EMPLEADO.getListaHorariosEmpleadoByCodigo);


export default router;