import { Request, Response } from 'express'
export const getMaterias = (req: Request, res: Response) => {
    res.json({ msg: 'getMaterias' });
}

export const postNuevaMateria = (req: Request, res: Response) => {
    res.json({ msg: 'postNuevaMateria' });
}

export const putEditarMateria = (req: Request, res: Response) => {
    res.json({ msg: 'putEditarMateria' });
}

export const deleteEliminarMateria = (req: Request, res: Response) => {
    res.json({ msg: 'deleteEliminarMateria' });
}