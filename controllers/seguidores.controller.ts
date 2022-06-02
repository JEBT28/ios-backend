import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const { usuarios: Usuarios, usuariosSeguidos: UsuariosSeguidos } = new PrismaClient();

export const getUsuariosSeguidos = async (req: Request, res: Response) => {
    const { usuario } = res.locals;

    try {
        const results = await Usuarios.findFirst({
            where: {
                usuario,
                status: true
            },
            select: {
                Seguidos: {
                    where: {
                        status: true
                    }
                }
            }
        })

        return res.json({ ok: true, results })
    } catch (error: any) {
        return res.status(400).json({ ok: true, msg: "Ocurrio un problem al recuperar los usuarios seguidos" });
    }
}

export const postSeguirUsuario = async (req: Request, res: Response) => {
    const { usuario } = req.body;
    const { idUsuario: idSeguidor } = res.locals;

    try {
        const existe = await Usuarios.findFirst({
            where: {
                usuario,
                status: true
            }
        });

        if (!existe) {
            throw new Error("El usuario que se va seguir no existe");
        }


        const existeRelacion = await UsuariosSeguidos.findFirst({
            where: {
                idSeguidor,
                idSeguido: existe.idUsuario,
                status: true
        }})

        if(existeRelacion) {
            throw new Error("Ya seguiste a este usuario");
        }

        await UsuariosSeguidos.create({
            data: {
                idSeguido:existe.idUsuario,
                idSeguidor,
            }
        });

        return res.json({ ok: true, msg: "Usuario seguido correctamente" });

    } catch (error: any) {
        return res.status(400).json({ ok: true, msg: "Ocurrio un problem al seguir al usuario" });
    }
}