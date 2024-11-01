import jwt from 'jsonwebtoken';
import UserInfo from '../models/userInfo.js'; // Ajusta la ruta según tu estructura de archivos
import mongoose from 'mongoose';

const JWT_SECRET = 'mi_secreto_super_seguro';

export const authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('Token recibido:', token); // Imprime el token recibido

  if (!token) {
      return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Busca el usuario usando el usuarioRef decodificado del token
      const user = await UserInfo.findById(decoded.usuarioRef);
      
      if (!user) {
          return res.status(404).json({ error: 'Usuario no encontrado.' });
      }

      req.user = user; // Asegúrate de que `req.user` contenga el usuario completo
      next();
  } catch (error) {
      console.error('Error de verificación de token:', error.message); // Imprime el mensaje de error específico
      res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

export const authorize = (role) => (req, res, next) => {
    if (req.user.Role !== role) {
        return res.status(403).json({ error: 'Acceso denegado. Rol insuficiente.' });
    }
    next();
};
