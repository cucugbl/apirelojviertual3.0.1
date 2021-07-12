import express, { Application } from 'express';
import indexRoutes from './routes/rutas';
import morgan from 'morgan';
const app: Application = express();
import cors from 'cors';

app.use(cors());
// middlewares

app.use(morgan('dev'));

app.use(express.json());

app.use(express.urlencoded({ extended: false })); //para recibir datos livianos, para imagenes es otro

// Routes
app.use('/api', indexRoutes);

app.listen(3000);
console.log('Server on port', 3000);
