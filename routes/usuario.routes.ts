import { Router } from "express";
import {
    deleteEliminarUsuario, getUsuarios,
    postIniciarSesion, postNuevoUsuario,
    putEditarContraseña, putEditarUsuario,
    renovarToken
} from './../controllers/usuario.controller';

const router = Router()

router.get("/", getUsuarios);
router.post("/", postNuevoUsuario);
router.put("/:id", putEditarUsuario);
router.delete("/:id", deleteEliminarUsuario);
router.put("/contraseña/:id", putEditarContraseña);
router.post("/auth/", postIniciarSesion)
router.get("/auth/renew", renovarToken);
