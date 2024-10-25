import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

export const generateToken = (user) => {
    // Asegúrate de incluir el rol y otros datos relevantes en el payload
    const payload = {
        usuarioId: user._id,
        rol: user.Role // Incluye el rol en el token
    };

    return jwt.sign(payload, process.env.TOKEN_CRYPT_KEY, { expiresIn: '8h' });
}

export const verifyToken = (token) => {
    try {
        // Verifica y decodifica el token
        return jwt.verify(token, process.env.TOKEN_CRYPT_KEY);
    } catch (error) {
        // Manejo de errores en caso de token inválido
        console.error("Token inválido:", error.message);
        return null; // Retorna null si el token es inválido
    }
}
