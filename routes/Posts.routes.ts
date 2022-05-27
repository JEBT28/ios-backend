import { Router } from "express";
import { validarJWT } from './../middlewares/validarJWT.middleware';
import { getPostsDeUsuariosSeguidos, postNuevaPublicacion, deletePublicacion } from './../controllers/posts.controller';

const router = Router();


router.get("/", validarJWT, getPostsDeUsuariosSeguidos);
router.post("/", validarJWT, postNuevaPublicacion);
router.delete("/:id", validarJWT, deletePublicacion);

export default router