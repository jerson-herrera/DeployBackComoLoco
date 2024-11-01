import { Router } from "express"

const codesRouter = Router()

import { createCodes, getAllCodes, getPremiados } from "../controllers/codigosController.js";

codesRouter.post('/createCodes', createCodes); //Vetifica credenciales para el loggin
codesRouter.get('/getPremiados', getPremiados); 
codesRouter.get('/getAllCodes', getAllCodes); 




export default codesRouter;
