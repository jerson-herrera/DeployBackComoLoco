import UserInfoModel from "../models/userInfo.js"
import UserModel from "../models/users.js"
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';

config();


const JWT_SECRET = 'mi_secreto_super_seguro';
//Funcio para crear usuario
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



//Funcion para login
export const verificarCredenciales = async (req, res) => {
    try {
        const { Usuario, Password } = req.body;

        const user = await UserModel.findOne({ Usuario }).populate('usuarioRef'); // Asegúrate de obtener también la información del usuario
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

        if (Password !== user.Password) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Generar el token incluyendo el rol
        const token = jwt.sign(
            { id: user._id, Role: user.Role, usuarioRef: user.usuarioRef }, // Incluye el usuarioRef
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
        console.error('Error en el servidor:', error); // Imprime el error en la consola
        res.status(500).json({ error: 'Error en el servidor' });
    }
};