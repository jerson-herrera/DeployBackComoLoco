import { Router } from "express";
import { crearIntento,obtenerIntentosConPremio } from "../controllers/intentosController.js";
import { authenticate, authorize } from "../middleware/authentication.js"; // Importamos los middlewares

const intentosRouter = Router();

// Ruta protegida: solo usuarios autenticados pueden crear intentos
intentosRouter.post('/createIntento', authenticate, crearIntento);


intentosRouter.get('/getIntentosGanadores', authenticate, obtenerIntentosConPremio);


export default intentosRouter;
