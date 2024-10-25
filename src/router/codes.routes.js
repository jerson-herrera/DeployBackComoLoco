import { Router } from "express"

const codesRouter = Router()

import { createCodes, getAllCodes, getPremiados, obtenerUsersGanadores } from "../controllers/codigosController.js";

codesRouter.post('/createCodes', createCodes); //Vetifica credenciales para el loggin
codesRouter.get('/getPremiados', getPremiados); 
codesRouter.get('/getAllCodes', getAllCodes); 
codesRouter.get("/getUsersGanadores", obtenerUsersGanadores)



export default codesRouter;
