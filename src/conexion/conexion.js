import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Cargar las variables de entorno

// Variables para conectarse a MongoDB
const MONGODB_USERNAME = process.env.MONGODB_USERNAME;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const MONGODB_DATABASE = process.env.MONGODB_DATABASE;
const MONGODB_URI = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@cluster0.xl5o8.mongodb.net/${MONGODB_DATABASE}?retryWrites=true&w=majority`;



let intentos = 0; 
// Función para conectarse a MongoDB con reintentos
export const connectDB = async () => {
    try {
        console.log("Estableciendo conexión a MongoDB...");
        await mongoose.connect(MONGODB_URI); // Opciones obsoletas eliminadas
        console.log('Conectado a MongoDB');
        return true; // Conexión exitosa
    } catch (error) {
        intentos++;
        console.error('Error de conexión a MongoDB:', error.message);

        if (intentos <= 15) { 
            console.log(`Reintentando conexión a MongoDB, intento #${intentos}`);
            return await connectDB(); 
        } else {
            console.error('Conexión fallida, máximo de intentos alcanzados');
            return false;
        }
    }
};
