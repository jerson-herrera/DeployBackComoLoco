import { Router } from "express"
import { validateSchema } from "../middleware/validatorMiddleware.js"
import { userInfoSchema } from "../schemas/userSchema.js"
import { authenticate, authorize } from '../middleware/authentication.js';

const userRouter = Router()

import { createUser, verificarCredenciales,updateUser, getUsers } from "../controllers/usersController.js"

userRouter.post('/loggin', verificarCredenciales); //Vetifica credenciales para el loggin
userRouter.post("/createUser",validateSchema(userInfoSchema), createUser)
userRouter.put("/updateUser/:userID", updateUser)
userRouter.get("/getUsers", getUsers)


userRouter.get('/perfil', authenticate, (req, res) => {
    res.json({ message: `Bienvenido, ${req.user.id}` });
});

userRouter.get('/admin', authenticate, authorize('admin'), (req, res) => {
    res.json({ message: 'Bienvenido al panel de administrador' });
});


export default userRouter;
