import { Router } from "express"
import { validateSchema } from "../middleware/validatorMiddleware.js"
import { userInfoSchema } from "../schemas/userSchema.js"

const userRouter = Router()

import { createUser, verificarCredenciales, getUsers } from "../controllers/usersController.js"

userRouter.post('/loggin', verificarCredenciales); //Vetifica credenciales para el loggin
userRouter.post("/createUser",validateSchema(userInfoSchema), createUser)
userRouter.get("/getUsers", getUsers)

export default userRouter;
