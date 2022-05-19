import { Request, Response } from 'express'
export const getMaestros = (req: Request, res: Response) => {
    res.json({ msg: 'getMaestros' });
}

export const postNuevoMaestro = (req: Request, res: Response) => {
    res.json({ msg: 'postNuevoMaestro' });
}

export const putEditarMaestro = (req: Request, res: Response) => {
    res.json({ msg: 'putEditarMaestro' });
}

export const deleteEliminarMaestro = (req: Request, res: Response) => {
    res.json({ msg: 'deleteEliminarMaestro' });
}