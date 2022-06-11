import { Router } from "express";
import {
    deleteEliminarUsuario, getBuscarUsuarios, getUsuario, getUsuarios,
    postIniciarSesion, postNuevoUsuario,
    putEditarContrasena, putEditarUsuario,
    renovarToken,
    subirFotoUsuario
} from '../controllers/usuario.controller';
import { validarJWT } from "../middlewares/validarJWT.middleware";
import { validarSchema } from "../middlewares/validarSchema.middleware";
import { usuarioSchema, eliminarUsuarioSchema, editarContrasenaSchema, editarUsuarioSchema, iniciarSesionSchema } from '../middlewares/schemas/usuarios/usuario.schema';

const router = Router()

router.get("/", validarJWT, getUsuarios);
router.get("/busqueda/", validarJWT,getBuscarUsuarios)
router.get("/:usuario", validarJWT, getUsuario);
router.post("/", validarSchema(usuarioSchema), postNuevoUsuario);
router.put("/contrasena/", validarJWT, validarSchema(editarContrasenaSchema), putEditarContrasena);
router.put("/:usuario", validarJWT, validarSchema(editarUsuarioSchema), putEditarUsuario);
router.delete("/:usuario", validarJWT, validarSchema(eliminarUsuarioSchema), deleteEliminarUsuario);
router.post("/foto", validarJWT, subirFotoUsuario);
router.post("/auth/", validarSchema(iniciarSesionSchema), postIniciarSesion)
router.get("/auth/renew", renovarToken);

export default router;