import { Router } from "express";
import { validarJWT } from "../middlewares/validarJWT.middleware";
import { deleteEliminarAlumno, getAlumnos, postNuevoAlumno, putEditarAlumno } from './../controllers/alumnos.controller';

const router = Router();

router.get("/", validarJWT, getAlumnos);
router.post("/", validarJWT, postNuevoAlumno);
router.put("/:id", validarJWT, putEditarAlumno);
router.delete("/:id", validarJWT, deleteEliminarAlumno);


export default router;
