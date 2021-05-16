"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificarToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/* AQUI VA LA VERIFICACION DEL TOKEN, SI SE NECESITA EL VALOR QUE
 SE OBTIENE DEL TOKEN se debe enviar por el res al valor que se obtiene de jwt.verify*/
const verificarToken = (req, res, next) => {
    const token = req.header('autorizacion');
    if (!token)
        return res.status(401).json('No puede acceder sin autenticarse');
    jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRETO || "masSeguridad");
    next();
};
exports.verificarToken = verificarToken;
