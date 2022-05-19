import { Router } from "express";
import { getMaestros, postNuevoMaestro, putEditarMaestro, deleteEliminarMaestro } from "../controllers/maestros.controller";

const router = Router();

router.get("/", getMaestros);
router.post("/", postNuevoMaestro);
router.put("/:id", putEditarMaestro);
router.delete("/:id", deleteEliminarMaestro);


export default router;