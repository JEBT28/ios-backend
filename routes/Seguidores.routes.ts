import { Router } from "express";
import { getUsuariosSeguidos, postSeguirUsuario } from "../controllers/seguidores.controller";
import { validarJWT } from './../middlewares/validarJWT.middleware';

const router = Router();


router.get("/seguidos",validarJWT,getUsuariosSeguidos)
router.post("/nuevo",validarJWT,postSeguirUsuario)

export default router;