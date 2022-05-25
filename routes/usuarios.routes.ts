import { Router } from "express";
import {
    deleteEliminarUsuario, getUsuarios,
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
router.post("/", validarSchema(usuarioSchema), postNuevoUsuario);
router.put("/:id", validarJWT, validarSchema(editarUsuarioSchema), putEditarUsuario);
router.delete("/:id", validarJWT, validarSchema(eliminarUsuarioSchema), deleteEliminarUsuario);
router.post("/foto", validarJWT, subirFotoUsuario);
router.put("/contrasena/:id", validarJWT, validarSchema(editarContraseñaSchema), putEditarContraseña);
router.post("/auth/", validarSchema(iniciarSesionSchema), postIniciarSesion)
router.get("/auth/renew", renovarToken);


export default router;