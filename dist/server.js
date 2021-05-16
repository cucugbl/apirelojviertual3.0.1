"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const rutas_1 = __importDefault(require("./routes/rutas"));
const morgan_1 = __importDefault(require("morgan"));
const app = express_1.default();
const cors_1 = __importDefault(require("cors"));
app.use(cors_1.default());
// middlewares
app.use(morgan_1.default('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false })); //para recibir datos livianos, para imagenes es otro
// Routes
app.use('/api', rutas_1.default);
app.listen(3000);
console.log('Server on port', 3000);
