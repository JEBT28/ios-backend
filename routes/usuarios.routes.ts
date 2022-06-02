import { Router } from "express";
import {
    deleteEliminarUsuario, getUsuario, getUsuarios,
    postIniciarSesion, postNuevoUsuario,
    putEditarContraseña, putEditarUsuario,
    renovarToken,
    subirFotoUsuario
} from '../controllers/usuario.controller';
import { validarJWT } from "../middlewares/validarJWT.middleware";
import { validarSchema } from "../middlewares/validarSchema.middleware";
import { usuarioSchema, eliminarUsuarioSchema, editarContraseñaSchema, editarUsuarioSchema, iniciarSesionSchema } from './../middlewares/schemas/usuarios/usuario.schema';

const router = Router()

router.get("/", validarJWT, getUsuarios);
router.get("/:usuario", validarJWT, getUsuario);
router.post("/", validarSchema(usuarioSchema), postNuevoUsuario);
router.put("/:usuario", validarJWT, validarSchema(editarUsuarioSchema), putEditarUsuario);
router.delete("/:usuario", validarJWT, validarSchema(eliminarUsuarioSchema), deleteEliminarUsuario);
router.post("/foto", validarJWT, subirFotoUsuario);
router.put("/contrasena/", validarJWT, validarSchema(editarContraseñaSchema), putEditarContraseña);
router.post("/auth/", validarSchema(iniciarSesionSchema), postIniciarSesion)
router.get("/auth/renew", renovarToken);

export default router;