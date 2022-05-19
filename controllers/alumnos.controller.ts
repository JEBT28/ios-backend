import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client';

const { alumnos: Alumnos } = new PrismaClient()

export const getAlumnos = async (req: Request, res: Response) => {
    try {
        const alumnos = await Alumnos.findMany({
            // where: {
            //     status: true
            // }
        })

        return res.json({
            ok: true,
            msg: "Listado de alumnos",
            results: alumnos
        })
    } catch (err: any) {
        return res.status(400).json({
            ok: false,
            msg: "Ocurrio un problema consultando el listado de alumnos",
            value: err
        })
    }
}

export const postNuevoAlumno = async (req: Request, res: Response) => {
    const data = req.body;
    console.log("🚀 ~ file: alumnos.controller.ts ~ line 30 ~ postNuevoAlumno ~ data", data)

    try {
        const alumno = await Alumnos.create({
            data: data
        })

        return res.json({
            ok: true,
            msg: "Alumno creado correctamente",
            results: alumno
        })

    } catch (err) {
        console.log("🚀 ~ file: alumnos.controller.ts ~ line 44 ~ postNuevoAlumno ~ err", err)
        return res.status(400).json({
            ok: false,
            msg: "Ocurrio un problema al crear un nuevo alumno",
            value: err
        })
    }
}

export const putEditarAlumno = async (req: Request, res: Response) => {
    const data = req.body;
    const { id } = req.params;
    try {

        const alumno = await Alumnos.findFirst({
            where: {
                idAlumno: +id,
                status: true
            }
        });

        if (!alumno) {
            throw new Error("El alumno no existe")
        }

        const alumnoEditado = await Alumnos.update({
            data: { ...data, updatedAt: new Date() },
            where: {
                idAlumno: +id,
            }
        })

        return res.json({
            ok: true,
            msg: "Alumno editado correctamente",
            results: alumnoEditado
        })
    } catch (err: any) {
        console.log("🚀 ~ file: alumnos.controller.ts ~ line 83 ~ putEditarAlumno ~ err", err)
        return res.status(400).json({
            ok: false,
            msg: "Ocurrio un problema al editar un alumno",
            value: err.message
        })
    }
}

export const deleteEliminarAlumno = async (req: Request, res: Response) => {
    const data = req.body;
    const { id } = req.params;
    try {

        const alumno = await Alumnos.findFirst({
            where: {
                idAlumno: +id,
                status: true
            }
        });

        if (!alumno) {
            throw new Error("El alumno no existe")
        }

        const alumnoEliminado = await Alumnos.update({
            data: { status: false, updatedAt: new Date() },
            where: {
                idAlumno: +id,
            }
        })

        return res.json({
            ok: true,
            msg: "Alumno eliminado correctamente",
            results: alumnoEliminado
        })
    } catch (err: any) {
        console.log("🚀 ~ file: alumnos.controller.ts ~ line 83 ~ putEditarAlumno ~ err", err)
        return res.status(400).json({
            ok: false,
            msg: "Ocurrio un problema al eliminar un alumno",
            value: err.message
        })
    }
}