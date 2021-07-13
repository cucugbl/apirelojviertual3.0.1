import express, { Application } from 'express';

import EMPLEADOS_Routes from './routes/empleados.routes';
import EMPRESA_Routes from './routes/empresa.routes';
import REPORTES_Routes from './routes/reportes.routes';
import ROL_Routes from './routes/rol.routes';
import TIMBRES_Routes from './routes/timbre.routes';
import TIPO_TIMBRE_Routes from './routes/tipoTimbre.routes';
import USUARIO_Routes from './routes/usuario.routes';

import morgan from 'morgan';
const app: Application = express();
import cors from 'cors';

app.use(cors());
// middlewares

app.use(morgan('dev'));

app.use(express.json());

app.use(express.urlencoded({ extended: false })); //para recibir datos livianos, para imagenes es otro

// Routes
app.use('/api/user', USUARIO_Routes);
app.use('/api/empleado', EMPLEADOS_Routes);
app.use('/api/enterprise', EMPRESA_Routes);
app.use('/api/ring', TIMBRES_Routes);
app.use('/api/reportes', REPORTES_Routes);
app.use('/api/roles', ROL_Routes);
app.use('/api/tipoTimbre', TIPO_TIMBRE_Routes);

app.listen(3001);
console.log('Server on puerto', 3001);
