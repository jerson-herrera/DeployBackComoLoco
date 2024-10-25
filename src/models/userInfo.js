import mongoose from "mongoose";

const userInfoSchema = new mongoose.Schema({
    Nombre: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100,
    },
    FechaNacimiento: {
        type: Date,
        required: true,
    },
    Cedula: {
        type: String,
        required: true,
        unique: true,
        minlength: 4,
        maxlength: 20,
    },
    Correo: {
        type: String,
        required: true,
        unique: true,
        maxlength: 50
    },
    Celular: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/, // Solo 10 dígitos numéricos
    },
    Ciudad: {
        type: String,
        required: true,
        maxlength: 100
    },
    Password: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    }
});

const UserInfo = mongoose.model('UserInfo', userInfoSchema);
export default UserInfo;
