import { Router } from "express";
import { getMaterias, postNuevaMateria, putEditarMateria, deleteEliminarMateria } from "../controllers/materias.controller";

const router = Router();

router.get("/", getMaterias);
router.post("/", postNuevaMateria);
router.put("/:id", putEditarMateria);
router.delete("/:id", deleteEliminarMateria);


export default router;