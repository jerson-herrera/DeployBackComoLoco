import IntentosModel from '../models/intentos.js';
import Codigo from '../models/codigos.js';

//Crear el intento de usuario 
export const crearIntento = async (req, res) => {
    const { codigo } = req.body;
    const { user } = req;

    // Verifica que el ID del usuario está disponible en req.user
    console.log("ID del usuario:", user._id); // Esto imprimirá el ID del usuario en la consola

    try {
        // Busca el código en la base de datos
        const codigoEncontrado = await Codigo.findOne({ Codigo: codigo });

        if (!codigoEncontrado) {
            return res.status(400).json({ error: 'Código no válido.' });
        }

        // Verifica si el código ya ha sido usado
        if (codigoEncontrado.Estado === 'usado') {
            return res.status(400).json({ error: 'Código ya registrado.' }); // Mensaje de código ya usado
        }

        // Crea el nuevo intento
        const nuevoIntento = new IntentosModel({
            codigo: codigoEncontrado.Codigo,
            userId: user._id, // Asegúrate de que `user._id` esté definido y sea un ObjectId válido
        });

        // Guarda el nuevo intento en la base de datos
        await nuevoIntento.save();

        // Actualiza el estado del código
        codigoEncontrado.Estado = 'usado';
        codigoEncontrado.usuario = user._id; // Asigna el ID del usuario que usa el código
        codigoEncontrado.FechaUso = nuevoIntento.fecha; // Establece la fecha de uso
        await codigoEncontrado.save();

        // Verifica si el código tiene premio
        if (codigoEncontrado.TienePremio) {
            return res.status(201).json({
                mensaje: '¡Ganaste!',
                premio: codigoEncontrado.Premio,
                nuevoIntento,
            });
        } else {
            return res.status(201).json({
                mensaje: 'No ganaste.',
                nuevoIntento,
            });
        }
    } catch (error) {
        console.error('Error al crear intento:', error);
        res.status(500).json({ error: 'Error al crear intento.' });
    }
};

// Obtener intentos del usuario con premio
export const obtenerIntentosConPremio = async (req, res) => {
    const { user } = req;

    try {
        // Obtener todos los intentos del usuario, incluyendo los datos de usuario y código
        const intentos = await IntentosModel.find({ userId: user.id })
            .populate('codigo')
            .populate('userId'); // Añadir esto para traer la info del usuario

        // Filtrar intentos que tengan premio
        const intentosConPremio = await Promise.all(
            intentos.map(async (intento) => {
                const codigo = await Codigo.findOne({ Codigo: intento.codigo });
                return {
                    fecha: intento.fecha,
                    codigo: intento.codigo,
                    premio: codigo.TienePremio ? codigo.Premio : null,
                    usuario: intento.userId ? {
                        Nombre: intento.userId.Nombre,
                        Correo: intento.userId.Correo,
                        Celular: intento.userId.Celular,
                        // Otros campos que quieras mostrar del usuario
                    } : null
                };
            })
        );

        // Filtrar solo los intentos que tienen premio
        const intentosFiltrados = intentosConPremio.filter(intento => intento.premio);

        res.status(200).json(intentosFiltrados);
    } catch (error) {
        console.error('Error al obtener los intentos:', error);
        res.status(500).json({ error: 'Error al obtener los intentos.' });
    }
};


