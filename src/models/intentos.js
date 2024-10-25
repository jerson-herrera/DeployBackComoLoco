import mongoose from "mongoose";

// Definición del esquema para Intentos
const intentosSchema = new mongoose.Schema({
    codigo: {
        type: String, // Cambiar a String
        required: true,
    },
    fecha: {
        type: Date,
        default: Date.now, // Valor por defecto: fecha actual
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Referencia al modelo de UserInfo
        ref: 'UserInfo', // Nombre del modelo de usuarios
        required: true,
    },
});

// Middleware para actualizar el estado del código y del usuario
intentosSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            // Encontrar el código asociado en la colección de Códigos
            const codigo = await mongoose.model('Codigo').findOne({ Codigo: this.codigo });
            if (codigo) {
                codigo.Estado = 'usado';
                codigo.usuario = this.userId; // Asigna el ID del usuario que usa el código
                codigo.FechaUso = this.fecha; // Establece la fecha de uso
                await codigo.save();
            } else {
                return next(new Error('Código no encontrado')); // Si no se encuentra el código
            }

            next(); // Continúa con la siguiente acción
        } catch (error) {
            next(error); // Lanza un error si ocurre algo
        }
    } else {
        next(); // Continúa sin hacer nada si no es un nuevo documento
    }
});

// Crear el modelo a partir del esquema
const Intentos = mongoose.model('Intentos', intentosSchema);

export default Intentos;
