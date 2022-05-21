import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

import brcypt from 'bcrypt'
import { generarToken } from '../helpers/generarToken.helper';

const { usuarios: Usuarios } = new PrismaClient();

export const getUsuarios = async (req: Request, res: Response) => {
    try {
        const usuarios = await Usuarios.findMany();
        return res.json({ ok: true, msg: "Listado de usuarios", results: usuarios });
    }
    catch (error: any) {
        return res.status(400).json({ ok: false, msg: "Ocurrio un problema consultando el listado de usuarios", value: error });
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
        return res.status(400).json({ ok: false, msg: "Ocurrio un problema al crear un nuevo usuario", value: error });
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
        return res.status(400).json({ ok: false, msg: "Ocurrio un problema al editar el usuario", value: error });
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
        return res.status(400).json({ ok: false, msg: "Ocurrio un problema al eliminar el usuario", value: error });
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
        return res.status(400).json({ ok: false, msg: "Ocurrio un problema al editar la contraseña", value: error });
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
        return res.status(400).json({ ok: false, msg: "Ocurrio un problema al iniciar sesion", value: error });
    }
}

export const renovarToken = async (req: Request, res: Response) => {

}