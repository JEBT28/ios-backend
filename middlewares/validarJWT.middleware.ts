import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

import { PrismaClient } from "@prisma/client";

const { usuarios: Usuarios } = new PrismaClient();

export const validarJWT = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("x-token");

    if (!token) {
        return res.status(401).json({ ok: false, msg: "No hay token en la peticion" })
    }

    try {
        const usuario: any = jwt.verify(token, process.env.SECRETKEY!);
        const existe = await Usuarios.findFirst({
            where: {
                idUsuario: usuario.idUsuario,
                status: true
            }
        })
        if (!existe) {
            return res.status(401).json({ ok: false, msg: "El usuario no existe" })
        }

        next();

    } catch (error: any) {
        return res.status(400).json({ ok: false, msg: "No se pudo validar el token" })
    }

}