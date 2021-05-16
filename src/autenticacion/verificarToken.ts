import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

/* AQUI VA LA VERIFICACION DEL TOKEN, SI SE NECESITA EL VALOR QUE
 SE OBTIENE DEL TOKEN se debe enviar por el res al valor que se obtiene de jwt.verify*/

export const verificarToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('autorizacion');
    if(!token) return res.status(401).json('No puede acceder sin autenticarse');

    jwt.verify(token,process.env.TOKEN_SECRETO ||  "masSeguridad");
    
    next();
}