import express, { json } from "express";
import cors from "cors";
import userRouter from "./router/user.routes.js";
import codesRouter from "./router/codes.routes.js";
import intentosRouter from "./router/intentos.routes.js"

import { connectDB } from "./conexion/conexion.js";
await connectDB();



const app = express();
const port = process.env.PORT || 3003;

app.use(cors());
app.use(json());

app.use("/users",userRouter)
app.use("/codes",codesRouter)
app.use("/intentos",intentosRouter)

app.listen(port, "0.0.0.0", () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
