import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

import brcypt from 'bcrypt'
import { generarToken } from '../helpers/generarToken.helper';
import { verificarToken } from '../helpers/verificarToken.helper';

const { usuarios: Usuarios } = new PrismaClient();

export const getUsuarios = async (req: Request, res: Response) => {
    try {
        const usuarios = await Usuarios.findMany();
        return res.json({ ok: true, msg: "Listado de usuarios", results: usuarios });
    }
    catch (error: any) {
        console.log("🚀 ~ file: usuario.controller.ts ~ line 16 ~ getUsuarios ~ error", error)
        return res.status(400).json({ ok: false, msg: "Ocurrio un problema consultando el listado de usuarios", value: error });
        console.log("🚀 ~ file: usuario.controller.ts ~ line 17 ~ getUsuarios ~ error", error)
    }
}

export const postNuevoUsuario = async (req: Request, res: Response) => {
    const { contrasena, ...data } = req.body;
    try {
        const encrypted = await brcypt.hash(contrasena, 10);
        data.contrasena = encrypted;
        const nuevoUsuario = await Usuarios.create({ data: data });
        return res.json({ ok: true, msg: "Usuario creado correctamente" });
    }
    catch (error: any) {
        console.log("🚀 ~ file: usuario.controller.ts ~ line 29 ~ postNuevoUsuario ~ error", error)
        return res.status(400).json({ ok: false, msg: "Ocurrio un problema al crear un nuevo usuario", value: error });
        console.log("🚀 ~ file: usuario.controller.ts ~ line 33 ~ postNuevoUsuario ~ error", error)
    }
}

export const putEditarUsuario = async (req: Request, res: Response) => {
    const data = req.body;
    const { id } = req.params;

    try {
        const usuario = await Usuarios.findFirst({ where: { idUsuario: +id } });

        if (!usuario) {
            return res.status(404).json({ ok: true, msg: "El usuario no existe" })
        }

        const editarUsuario = await Usuarios.update({
            where: { idUsuario: +id },
            data: data
        });

        return res.json({ ok: true, msg: "Usuario editado correctamente", results: editarUsuario });
    }
    catch (error: any) {
        console.log("🚀 ~ file: usuario.controller.ts ~ line 56 ~ putEditarUsuario ~ error", error)
        return res.status(400).json({ ok: false, msg: "Ocurrio un problema al editar el usuario", value: error });
        console.log("🚀 ~ file: usuario.controller.ts ~ line 58 ~ putEditarUsuario ~ error", error)
    }
}

export const deleteEliminarUsuario = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const usuario = await Usuarios.findFirst({ where: { idUsuario: +id } });

        if (!usuario) {
            return res.status(404).json({ ok: true, msg: "El usuario no existe" })
        }

        const eliminarUsuario = await Usuarios.update({
            where: { idUsuario: +id },
            data: { status: false }
        });

        return res.json({ ok: true, msg: "Usuario eliminado correctamente", results: eliminarUsuario });
    }
    catch (error: any) {
        console.log("🚀 ~ file: usuario.controller.ts ~ line 79 ~ deleteEliminarUsuario ~ error", error)
        return res.status(400).json({ ok: false, msg: "Ocurrio un problema al eliminar el usuario", value: error });
        console.log("🚀 ~ file: usuario.controller.ts ~ line 81 ~ deleteEliminarUsuario ~ error", error)
    }
}

export const putEditarContraseña = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { actual, nueva } = req.body;

    try {
        const usuario = await Usuarios.findFirst({ where: { idUsuario: +id, status: true } });

        if (!usuario) {
            return res.status(404).json({ ok: true, msg: "El usuario no existe" })
        }

        const contrasena = await brcypt.compare(actual, usuario.contrasena);

        if (!contrasena) {
            return res.status(400).json({ ok: false, msg: "La contraseña actual no es correcta" })
        }

        const editarContrasena = await Usuarios.update({
            where: { idUsuario: +id },
            data: { contrasena: nueva }
        });

        return res.json({ ok: true, msg: "Contraseña editada correctamente", results: editarContrasena });

    } catch (error) {
        console.log("🚀 ~ file: usuario.controller.ts ~ line 110 ~ constputEditarContraseña= ~ error", error)
        return res.status(400).json({ ok: false, msg: "Ocurrio un problema al editar la contraseña", value: error });
        console.log("🚀 ~ file: usuario.controller.ts ~ line 112 ~ constputEditarContraseña= ~ error", error)
    }
}

export const postIniciarSesion = async (req: Request, res: Response) => {
    const { usuario, contrasena } = req.body;
    try {
        const usuarioDB = await Usuarios.findFirst({ where: { usuario: usuario, status: true } });

        if (!usuarioDB) {
            return res.status(404).json({ ok: true, msg: "El usuario no existe" })
        }

        const contrasenaDB = await brcypt.compare(contrasena, usuarioDB.contrasena);

        if (!contrasenaDB) {
            return res.status(400).json({ ok: false, msg: "La contraseña no es correcta" })
        }

        const token = generarToken(usuarioDB);

        return res.json({ ok: true, msg: "Inicio de sesion exitoso", results: { usuario: usuarioDB, token } });

    } catch (error) {
        console.log("🚀 ~ file: usuario.controller.ts ~ line 136 ~ postIniciarSesion ~ error", error)
        return res.status(400).json({ ok: false, msg: "Ocurrio un problema al iniciar sesion", value: error });
        console.log("🚀 ~ file: usuario.controller.ts ~ line 138 ~ postIniciarSesion ~ error", error)
    }
}

export const renovarToken = async (req: Request, res: Response) => {
    //Renew token from token
    const token  = req.header("x-token")!

    try {
        const {usuario} = await verificarToken(token);
        console.log("🚀 ~ file: usuario.controller.ts ~ line 136 ~ renovarToken ~ usuario", usuario)
        const tokenRenew = generarToken(usuario);
        console.log("🚀 ~ file: usuario.controller.ts ~ line 138 ~ renovarToken ~ tokenRenew", tokenRenew)
        return res.json({ ok: true, msg: "Token renovado", results: { token: tokenRenew } });
    } catch(error:any){
            console.log("🚀 ~ file: usuario.controller.ts ~ line 153 ~ renovarToken ~ error", error)
            return res.status(401).json({ ok: false, msg: "Ocurrio un problema al renovar el token", value: error });
            console.log("🚀 ~ file: usuario.controller.ts ~ line 155 ~ renovarToken ~ error", error)
    }
}