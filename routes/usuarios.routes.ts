import { Router } from "express";
import {
    deleteEliminarUsuario, getUsuarios,
    postIniciarSesion, postNuevoUsuario,
    putEditarContraseña, putEditarUsuario,
    renovarToken
} from '../controllers/usuario.controller';
import { validarJWT } from "../middlewares/validarJWT.middleware";

const router = Router()

router.get("/",validarJWT, getUsuarios);
router.post("/",validarJWT, postNuevoUsuario);
router.put("/:id",validarJWT, putEditarUsuario);
router.delete("/:id",validarJWT ,deleteEliminarUsuario);
router.put("/contraseña/:id",validarJWT, putEditarContraseña);
router.post("/auth/",validarJWT ,postIniciarSesion)
router.get("/auth/renew",validarJWT, renovarToken);


export default router;