import UserInfoModel from "../models/userInfo.js"
import UserModel from "../models/users.js"
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';

config();


const JWT_SECRET = 'mi_secreto_super_seguro';

export const createUser = async (req, res) => {
    const { Nombre, FechaNacimiento, Cedula, Correo, Celular, Ciudad, Password, Role } = req.body;

    try {
        // Verificar si ya existe un usuario con el mismo correo
        const existingUser = await UserModel.findOne({ Usuario: Correo });
        if (existingUser) {
            return res.status(400).json({ error: 'Ya existe un usuario con ese correo.' });
        }

        // Crear el UserInfoModel
        const userInfo = new UserInfoModel({
            Nombre,
            FechaNacimiento,
            Cedula,
            Correo,
            Celular,
            Ciudad,
            Password,
        });

        // Guardar UserInfoModel
        await userInfo.save();

        // Crear el UserModel con el Role especificado o por defecto 'user'
        const user = new UserModel({
            Usuario: Correo,
            Password,
            Role: Role || 'user', // Asignar el rol que se pasó o 'user' si no se especifica
            usuarioRef: userInfo._id, // Referencia al nuevo UserInfoModel
        });

        // Guardar UserModel
        await user.save();

        res.status(201).json({ message: 'Usuario creado exitosamente.', userInfo, user });
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(500).json({ error: 'Error al crear el usuario.' });
    }
};



//METODO PARA VERFICAR LAS CREDENCIALES Y DARLE ACCESO AL USUARIO
// export const verificarCredenciales = async (req, res) => {
//     console.log("\n\nFuncion: verificarCredenciales()");
//     try {
//         const { Usuario, Password } = req.body;

//         if (!Usuario || !Password) {
//             console.log("No llega Usuario o Password");
//             return res.status(400).json({ Error: 'Ausencia de datos para completar la solicitud' });
//         }

//         // Consultar si existe el usuario en la colección de UserModel
//         const datosAcceso = await UserModel.findOne({ Usuario }).populate('usuarioRef');

//         if (!datosAcceso) {
//             console.log("Usuario no encontrado");
//             return res.status(404).json({ Error: 'Usuario o clave incorrectas' });
//         }

//         // Verificar si la contraseña es correcta (comparando directamente con la cédula)
//         if (datosAcceso.Password !== Password) {
//             console.log("Clave incorrecta");
//             return res.status(404).json({ Error: 'Usuario o clave incorrectas' });
//         }

//         // Extraer datos del usuario relacionado
//         const { Nombres, TipoUsuario } = datosAcceso.usuarioRef;

//         const response = {
//             id: datosAcceso.usuarioRef._id,
//             Nombre: Nombres,
//             Role: TipoUsuario ? TipoUsuario.toLowerCase() : 'usuario'
//         };

//         // Generar el token 
//         const token = generateToken(response);

//         // Encriptar la respuesta si es necesario
//         let encryptedResponse = JSON.stringify(response);
//         encryptedResponse = CryptoJS.AES.encrypt(encryptedResponse, process.env.PASSWORD_ENCRYPT_KEY).toString();

//         console.log("Usuario encontrado, todo correcto");

//         // Devolver la respuesta encriptada y el token
//         return res.status(200).json({ user: encryptedResponse, token: token });

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ Error: 'Error del servidor' });
//     }
// };


// //Funcion para crear un User

// export const createUser = async (req, res) => {
//     try {
//         // Los datos ya han sido validados por el middleware
//         const datosValidados = req.body;

//         // Crear un nuevo usuario con los datos validados
//         const nuevoUser = new UserInfoModel(datosValidados);

//         // Guardar el usuario en la base de datos
//         await nuevoUser.save();

//         // Respuesta exitosa
//         res.status(201).json({ message: "User creado exitosamente", data: nuevoUser });
//     } catch (error) {
//         // Manejo de errores (por ejemplo, base de datos)
//         console.error("Error al crear el usuario:", error); // Imprime el error en la consola
//         res.status(500).json({ message: "Error al crear el user", error: error.message });
//     }
// };

//Funcion para actualizar usuario
export const updateUser = async (req, res) => {
    console.log("\n\nFuncion: updateUser()");
    try {
        const { userID } = req.params;
        const { Nombre, FechaNacimiento, Cedula, Correo, Celular, Ciudad, Password } = req.body; 

        // Busca el user por ID
        const userFound = await UserInfoModel.findById(userID);
        
        // Verifica si el user existe
        if (!userFound) {
            console.log("No fue posible actualizar el usuario porque NO existe");
            return res.status(400).json({ Error: `El usuario con el id ${userID} no existe` });
        }

        // Actualiza solo los campos que se recibieron en el cuerpo de la solicitud
        if (Nombre) userFound.Nombre = Nombre;
        if (FechaNacimiento) userFound.FechaNacimiento = FechaNacimiento;
        if (Cedula) userFound.Cedula = Cedula;
        if (Correo) userFound.Correo = Correo;
        if (Celular) userFound.Celular = Celular;
        if (Ciudad) userFound.Ciudad = Ciudad;
        if (Password) userFound.Password = Password;

        // Manejar la contraseña solo si se incluye en la solicitud
        // if (Contrasena) {
        //     // Si se recibe una nueva contraseña, asegúrate de que cumpla con tus requisitos de longitud y seguridad
        //     userFound.Contrasena = Contrasena; // Asegúrate de que este valor no exceda el límite
        // }

        // Guarda los cambios
        await userFound.save();

        console.log("Usuario actualizado correctamente");
        return res.status(200).json({ Message: 'Usuario actualizado correctamente' });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ Error: 'Error del servidor' });
    }
};


// Función para obtener todos los users

export const getUsers = async (req, res) => {
    console.log("\n\nFunción: getUsers()");
    try {
        // Busca todos los usuarios (sin considerar un campo Inactivo)
        const users = await UserInfoModel.find().select('Nombre Cedula Correo Ciudad');

        console.log(users);
        return res.status(200).json(users);
    } catch (error) {
        console.error("Error en getUsers:", error);
        return res.status(500).json({ Error: 'Error del servidor' });
    }
};






export const verificarCredenciales = async (req, res) => {
    try {
        const { Usuario, Password } = req.body;

        const user = await UserModel.findOne({ Usuario });
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

        if (Password !== user.Password) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Generar el token incluyendo el rol
        const token = jwt.sign(
            { id: user._id, Role: user.Role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Responder con el token y el rol del usuario
        res.json({
            message: 'Login exitoso',
            token,
            role: user.Role, // Incluir el rol en la respuesta
        });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
};
