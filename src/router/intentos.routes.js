import { Router } from "express";
import { crearIntento,obtenerIntentosConPremio, obtenerTodosIntentosConPremio} from "../controllers/intentosController.js";
import { authenticate } from "../middleware/authentication.js"; // Importamos los middlewares

const intentosRouter = Router();

// Ruta protegida: solo usuarios autenticados pueden crear intentos
intentosRouter.post('/createIntento', authenticate, crearIntento);


intentosRouter.get('/getIntentosGanadores', authenticate, obtenerIntentosConPremio);
intentosRouter.get('/getIntentosGanadoresAdmin', authenticate, obtenerIntentosConPremio);
intentosRouter.get('/getTodosIntentosGanadores', authenticate, obtenerTodosIntentosConPremio);

export default intentosRouter;
