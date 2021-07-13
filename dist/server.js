"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const empleados_routes_1 = __importDefault(require("./routes/empleados.routes"));
const empresa_routes_1 = __importDefault(require("./routes/empresa.routes"));
const reportes_routes_1 = __importDefault(require("./routes/reportes.routes"));
const rol_routes_1 = __importDefault(require("./routes/rol.routes"));
const timbre_routes_1 = __importDefault(require("./routes/timbre.routes"));
const tipoTimbre_routes_1 = __importDefault(require("./routes/tipoTimbre.routes"));
const usuario_routes_1 = __importDefault(require("./routes/usuario.routes"));
const morgan_1 = __importDefault(require("morgan"));
const app = express_1.default();
const cors_1 = __importDefault(require("cors"));
app.use(cors_1.default());
// middlewares
app.use(morgan_1.default('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false })); //para recibir datos livianos, para imagenes es otro
// Routes
app.use('/api/user', usuario_routes_1.default);
app.use('/api/empleado', empleados_routes_1.default);
app.use('/api/enterprise', empresa_routes_1.default);
app.use('/api/ring', timbre_routes_1.default);
app.use('/api/reportes', reportes_routes_1.default);
app.use('/api/roles', rol_routes_1.default);
app.use('/api/tipoTimbre', tipoTimbre_routes_1.default);
app.listen(3001);
console.log('Server on port', 3001);
