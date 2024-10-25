import jwt from 'jsonwebtoken';

const JWT_SECRET = 'mi_secreto_super_seguro';

export const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Token recibido:', token); // Imprime el token recibido
  
    if (!token) return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded; // Asegúrate de que el objeto `decoded` contenga la información que necesitas
      next();
    } catch (error) {
      console.error('Error de verificación de token:', error); // Imprime cualquier error
      res.status(401).json({ error: 'Token inválido o expirado' });
    }
  };
  

export const authorize = (role) => (req, res, next) => {
    if (req.user.Role !== role) {
        return res.status(403).json({ error: 'Acceso denegado. Rol insuficiente.' });
    }
    next();
};
