import { Request, Response } from 'express'
export const getAlumnos = (req: Request, res: Response) => {
    res.json({msg:"getAlumnos"});
}

export const postNuevoAlumno = (req: Request, res: Response) => {
    res.json({msg:"postNuevoAlumno"});
}

export const putEditarAlumno = (req: Request, res: Response) => {
    res.json({msg:"putEditarAlumno"});
}

export const deleteEliminarAlumno = (req: Request, res: Response) => {
    res.json({msg:"deleteEliminarAlumno"});
}