import mongoose from 'mongoose';

const usersSchema = new mongoose.Schema({
    Usuario: {
        type: String,
        required: true,
        unique: true,
        maxlength: 40,
    },
    Password: {
        type: String,
        required: true,
        maxlength: 50,
    },
    Role: {
        type: String,
        maxlength: 20, 
        default: 'user' // Valor por defecto
    },
    usuarioRef: {
        type: mongoose.Schema.Types.ObjectId, // Referencia al campo _id de userInfo
        ref: "UserInfo",
        required: true
    }
});

const User = mongoose.model("User", usersSchema);
export default User;
