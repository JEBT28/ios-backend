import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import brcypt from "bcrypt";
import { generarToken } from "../helpers/generarToken.helper";
import { verificarToken } from "../helpers/verificarToken.helper";
import { subirImagen } from "../helpers/subirImagen.helper";

const { usuarios: Usuarios } = new PrismaClient();

export const getUsuarios = async (req: Request, res: Response) => {
  try {
    const usuarios = await Usuarios.findMany({
      select: {
        idUsuario: true,
        nombre: true,
        apellido: true,
        usuario: true,
        status: true,
        foto: true,
        Posts: {
          where: {
            status: true,
          },
        },
        Seguidos: {
          select: {
            idUsuarioSeguido: true,
            Seguido: {
              select: {
                usuario: true,
                nombre: true,
                apellido: true,
              },
            },
          },
          where: {
            status: true,
          },
        },
        Seguidores: {
          select: {
            Seguidor: {
              select: {
                usuario: true,
                nombre: true,
                apellido: true,
              },
            },
          },
          where: {
            status: true,
          },
        },
      },
    });

    const results = usuarios.map((u) => {
      const seguidos = u?.Seguidos?.map(({ idUsuarioSeguido, Seguido }) => {
        return { idUsuarioSeguido, ...Seguido };
      });

      const seguidores = u?.Seguidores?.map(({ Seguidor }) => {
        return Seguidor;
      });

      const aux: any = u;
      delete aux?.Seguidores;
      delete aux?.Seguidos;

      return { ...u, Seguidores: seguidores, Seguidos: seguidos };
    });

    return res.json({
      ok: true,
      msg: "Listado de usuarios",
      results: results,
    });
  } catch (error: any) {
    console.log("🚀 ~ file: usuario.controller.ts ~ line 80 ~ getUsuarios ~ error", error)
    return res.status(400).json({
      ok: false,
      msg: "Ocurrio un problema consultando el listado de usuarios",
      value: error,
    });
  }
};

export const getUsuario = async (req: Request, res: Response) => {
  const { usuario } = req.params;
  try {
    const results = await Usuarios.findFirst({
      where: {
        usuario,
        status: true,
      },
      select: {
        idUsuario: true,
        nombre: true,
        apellido: true,
        usuario: true,
        status: true,
        foto: true,
        Posts: {
          where: {
            status: true,
          },
        },
        Seguidos: {
          select: {
            idUsuarioSeguido: true,
            Seguido: {
              select: {
                usuario: true,
                nombre: true,
                apellido: true,
              },
            },
          },
          where: {
            status: true,
          },
        },
        Seguidores: {
          select: {
            Seguidor: {
              select: {
                usuario: true,
                nombre: true,
                apellido: true,
              },
            },
          },
          where: {
            status: true,
          },
        },
      },
    });

    const seguidos = results?.Seguidos?.map(({ idUsuarioSeguido, Seguido }) => {
      return { idUsuarioSeguido, ...Seguido };
    });

    const seguidores = results?.Seguidores?.map(({ Seguidor }) => {
      return Seguidor;
    });

    const aux: any = results;
    delete aux?.Seguidores;
    delete aux?.Seguidos;

    return res.json({
      ok: true,
      msg: "Usuario encontrado",
      results: {
        Seguidores: seguidores,
        seguidos: seguidos,
        ...aux,
      },
    });
  } catch (error: any) {
    return res.status(400).json({
      ok: false,
      msg: "Ocurrio un problema consultando el usuario",
      value: error,
    });
  }
};

export const postNuevoUsuario = async (req: Request, res: Response) => {
  const { contrasena, ...data } = req.body;
  try {
    const encrypted = await brcypt.hash(contrasena, 10);
    data.contrasena = encrypted;

    const existe = await Usuarios.findFirst({
      where: {
        usuario: data.usuario,
        status: true,
      },
    });

    if (existe) {
      return res.status(400).json({
        ok: false,
        msg: "Ya existe otra cuenta con el usuario especificado",
      });
    }

    await Usuarios.create({ data: data });
    return res.json({ ok: true, msg: "Usuario creado correctamente" });
  } catch (error: any) {
    return res.status(400).json({
      ok: false,
      msg: "Ocurrio un problema al crear un nuevo usuario",
      value: error,
    });
  }
};

export const putEditarUsuario = async (req: Request, res: Response) => {
  const data = req.body;
  const { id } = req.params;

  try {
    const usuario = await Usuarios.findFirst({ where: { idUsuario: +id } });

    if (!usuario) {
      return res.status(404).json({ ok: true, msg: "El usuario no existe" });
    }

    const editarUsuario = await Usuarios.update({
      where: { idUsuario: +id },
      data: data,
      select: {
        idUsuario: true,
        nombre: true,
        apellido: true,
        usuario: true,
        status: true,
        foto: true,
      },
    });

    return res.json({
      ok: true,
      msg: "Usuario editado correctamente",
      results: editarUsuario,
    });
  } catch (error: any) {
    return res.status(400).json({
      ok: false,
      msg: "Ocurrio un problema al editar el usuario",
      value: error,
    });
  }
};

export const deleteEliminarUsuario = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const usuario = await Usuarios.findFirst({ where: { idUsuario: +id } });

    if (!usuario) {
      return res.status(404).json({ ok: true, msg: "El usuario no existe" });
    }

    const eliminarUsuario = await Usuarios.update({
      where: { idUsuario: +id },
      data: { status: false },
      select: { idUsuario: true },
    });

    return res.json({
      ok: true,
      msg: "Usuario eliminado correctamente",
      results: eliminarUsuario,
    });
  } catch (error: any) {
    return res.status(400).json({
      ok: false,
      msg: "Ocurrio un problema al eliminar el usuario",
      value: error,
    });
  }
};

export const putEditarContraseña = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { actual, nueva } = req.body;

  try {
    const usuario = await Usuarios.findFirst({
      where: { idUsuario: +id, status: true },
    });

    if (!usuario) {
      return res.status(404).json({ ok: true, msg: "El usuario no existe" });
    }

    const contrasena = await brcypt.compare(actual, usuario.contrasena);

    if (!contrasena) {
      return res
        .status(400)
        .json({ ok: false, msg: "La contraseña actual no es correcta" });
    }

    const hash = await brcypt.hash(nueva, 10);

    const editarContrasena = await Usuarios.update({
      where: { idUsuario: +id },
      data: { contrasena: hash },
    });

    return res.json({ ok: true, msg: "Contraseña editada correctamente" });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "Ocurrio un problema al editar la contraseña",
      value: error,
    });
  }
};

export const postIniciarSesion = async (req: Request, res: Response) => {
  const { usuario, contrasena } = req.body;
  try {
    const usuarioDB = await Usuarios.findFirst({
      where: { usuario: usuario, status: true },
    });

    if (!usuarioDB) {
      return res.status(404).json({ ok: true, msg: "El usuario no existe" });
    }

    const contrasenaDB = await brcypt.compare(contrasena, usuarioDB.contrasena);

    if (!contrasenaDB) {
      return res
        .status(400)
        .json({ ok: false, msg: "La contraseña no es correcta" });
    }

    const token = generarToken(usuarioDB);

    return res.json({
      ok: true,
      msg: "Inicio de sesion exitoso",
      results: { token, usuario:usuarioDB.usuario },
    });
  } catch (error) {
    console.log("🚀 ~ file: usuario.controller.ts ~ line 334 ~ postIniciarSesion ~ error", error)
    return res.status(400).json({
      ok: false,
      msg: "Ocurrio un problema al iniciar sesion",
      value: error,
    });
  }
};

export const renovarToken = async (req: Request, res: Response) => {
  //Renew token from token
  const token = req.header("x-token")!;

  try {
    const { usuario } = await verificarToken(token);
    const tokenRenew = generarToken(usuario);
    return res.json({
      ok: true,
      msg: "Token renovado",
      results: { token: tokenRenew, usuario: usuario.usuario },
    });
  } catch (error: any) {
    return res.status(401).json({
      ok: false,
      msg: "Ocurrio un problema al renovar el token",
      value: error,
    });
  }
};

export const subirFotoUsuario = async (req: Request, res: Response) => {
  const { img } = req.body;
  const { idUsuario } = res.locals;

  console.log("entre");
  try {
    const [url, error] = await subirImagen(img, `profile_${idUsuario}`);
    if (error) {
      throw error;
    }

    const usuario = await Usuarios.update({
      where: { idUsuario: +idUsuario },
      data: {
        foto: url,
      },
      select: {
        idUsuario: true,
        nombre: true,
        apellido: true,
        usuario: true,
        status: true,
        foto: true,
      },
    });

    return res.json({
      ok: true,
      msg: "Foto de usuario subida correctamente",
      results: usuario,
    });
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Ocurrio un problema al renovar el token",
      value: error,
    });
  }
};

export const getBuscarUsuarios = async (req: Request, res: Response)=>{

  const { busqueda }= req.body;

try {

} catch (error:any){

}
}