import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { subirImagen } from "./../helpers/subirImagen.helper";
import { randomUUID } from "crypto";

const { posts: Posts, usuariosSeguidos: UsuariosSeguidos } = new PrismaClient();

export const getPostsDeUsuariosSeguidos = async (
  req: Request,
  res: Response
) => {
  const { idUsuario } = res.locals;
  console.log("🚀 ~ file: posts.controller.ts ~ line 13 ~ idUsuario", idUsuario)

  try {
    const auxUsuario = await UsuariosSeguidos.findMany({
      where: {
        idSeguidor: idUsuario,
        status: true
      },
      select: {
        idSeguido: true,
        Seguido: {
          select: {
            usuario: true
          }
        }
      }
    });
    console.log("🚀 ~ file: posts.controller.ts ~ line 21 ~ auxUsuario", auxUsuario)

    const idSeguidosList = auxUsuario.map((s) => s.idSeguido);

    const posts = await Posts.findMany({
      where: {
        status: true,
        Usuarios: {
          idUsuario: {
            in: idSeguidosList
          }
        },
      },
    });

    const results = posts.map((p) => {
      const usuario = auxUsuario.find(u => u.idSeguido === p.idUsuario)!.Seguido.usuario

      return {
        usuario,
        ...p
      }
    })

    return res.json({ ok: true, results });
  } catch (error: any) {
    return res
      .status(400)
      .json({
        ok: false,
        msg: "Ocurrio un problema recuperando los posts del usuario",
        error,
      });
  }
};

export const postNuevaPublicacion = async (req: Request, res: Response) => {
  const { img, descripcion } = req.body;
  const { idUsuario } = res.locals;

  try {
    const [url, error] = await subirImagen(img, `${randomUUID()}`);

    if (error) {
      throw error;
    }

    await Posts.create({
      data: {
        img: url,
        idUsuario,
        descripcion,
      },
    });
    return res.json({
      ok: true,
      msg: "Se ha realizado la publicacion con exito",
    });
  } catch (error: any) {
    return res
      .status(400)
      .json({
        ok: false,
        msg: "Ocurrio un problema al guardar la publicacion",
        error,
      });
  }
};

export const deletePublicacion = async (req: Request, res: Response) => {
  const { id: idPost } = req.params;
  const { idUsuario } = res.locals;
  try {
    const existe = await Posts.findFirst({
      where: {
        idPost: +idPost,
        idUsuario,
        status: true,
      },
    });

    if (!existe) {
      throw new Error("El post seleccionado no existe");
    }

    await Posts.update({
      where: {
        idPost: +idPost,
      },
      data: {
        status: false,
      },
    });

    return res.json({ ok: true, msg: "Se ha eliminado el post con existe" });
  } catch (error: any) {
    return res
      .status(400)
      .json({
        ok: false,
        msg: "Ocurrio un problema al eliminar la publicacion",
        error,
      });
  }
};
