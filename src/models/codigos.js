import mongoose from 'mongoose';

// Esquema de Códigos
const codigoSchema = new mongoose.Schema({
    Codigo: {
        type: String,
        required: true,
        unique: true,
        maxlength: 4,
    },
    TienePremio: {
        type: Boolean,
        default: false,
    },
    Premio: {
        type: String,
        maxlength: 100, // Descripción del premio
    },
    Estado: { 
        type: String,
        enum: ['libre', 'usado'], // Solo acepta estos dos estados
        default: 'libre',
    },
    usuario: { // ID del usuario que lo usó (solo si está 'usado')
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserInfo', // Referencia al modelo del usuario
    },
    FechaUso: { // Fecha en que se usó el código
        type: Date,
    },
});

// Modelo de Código
const Codigo = mongoose.model('Codigo', codigoSchema);

export default Codigo;
