import { Router } from "express";
import { deleteEliminarAlumno, getAlumnos, postNuevoAlumno, putEditarAlumno } from './../controllers/alumnos.controller';

const router = Router();

router.get("/", getAlumnos);
router.post("/", postNuevoAlumno);
router.put("/:id", putEditarAlumno);
router.delete("/:id", deleteEliminarAlumno);


export default router;
