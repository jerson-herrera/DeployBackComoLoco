// import IntentosModel from '../models/intentos.js';
// import Codigo from '../models/codigos.js'; // Asegúrate de importar tu modelo de Codigos

// export const crearIntento = async (req, res) => {
//     const { user } = req; // Usuario autenticado

//     try {
//         const { codigo } = req.body;

//         // Verificar si el código proporcionado existe en la base de datos
//         const codigoEncontrado = await Codigo.findOne({ Codigo: codigo });

//         // Si el código no se encuentra, retorna un error
//         if (!codigoEncontrado) {
//             return res.status(404).json({ error: 'Código no encontrado.' });
//         }

//         // Si el código ya ha sido usado, retorna un error
//         if (codigoEncontrado.Estado === 'usado') {
//             return res.status(400).json({ error: 'El código ya ha sido usado.' });
//         }

//         // Crear el nuevo intento
//         const nuevoIntento = await IntentosModel.create({
//             codigo: codigo, // Almacena el código como string
//             userId: user.id, // ID del usuario autenticado
//         });

//         // Actualizar el estado del código a 'usado'
//         codigoEncontrado.Estado = 'usado';
//         codigoEncontrado.usuario = user.id; // Asigna el ID del usuario que usa el código
//         codigoEncontrado.FechaUso = nuevoIntento.fecha; // Establece la fecha de uso
//         await codigoEncontrado.save();

//         res.status(201).json({ message: 'Intento creado exitosamente', nuevoIntento });
//     } catch (error) {
//         console.error('Error al crear el intento:', error);
//         res.status(400).json({ error: error.message });
//     }
// };





// export const crearIntento = async (req, res) => {
//     const { user } = req;

//     try {
//         const { codigo } = req.body;

//         // Verificar si el código proporcionado existe en la base de datos
//         const codigoEncontrado = await Codigo.findOne({ Codigo: codigo });

//         // Si el código no se encuentra, retorna un error
//         if (!codigoEncontrado) {
//             return res.status(404).json({ error: 'Código no encontrado.' });
//         }

//         // Si el código ya ha sido usado, retorna un error
//         if (codigoEncontrado.Estado === 'usado') {
//             return res.status(400).json({ error: 'El código ya ha sido usado.' });
//         }

//         // Crear el nuevo intento
//         const nuevoIntento = await IntentosModel.create({
//             codigo: codigo,
//             userId: user.id,
//         });

//         // Actualizar el estado del código a 'usado'
//         codigoEncontrado.Estado = 'usado';
//         codigoEncontrado.usuario = user.id;
//         codigoEncontrado.FechaUso = nuevoIntento.fecha;
//         await codigoEncontrado.save();

//         res.status(201).json({ message: 'Intento creado exitosamente', nuevoIntento });
//     } catch (error) {
//         console.error('Error al crear el intento:', error); // Imprime el error completo para depuración
//         res.status(400).json({ error: error.message });
//     }
// };
import IntentosModel from '../models/intentos.js';
import Codigo from '../models/codigos.js';

export const crearIntento = async (req, res) => {
    const { codigo } = req.body;
    const { user } = req;

    try {
        // Busca el código en la base de datos
        const codigoEncontrado = await Codigo.findOne({ Codigo: codigo });

        if (!codigoEncontrado) {
            return res.status(400).json({ error: 'Código no válido.' });
        }

        // Verifica si el código ya ha sido usado
        if (codigoEncontrado.Estado === 'usado') {
            return res.status(400).json({ error: 'Este código ya ha sido usado.' });
        }

        // Crea el nuevo intento
        const nuevoIntento = new IntentosModel({
            codigo: codigoEncontrado.Codigo,
            userId: user.id,
        });

        // Guarda el nuevo intento en la base de datos
        await nuevoIntento.save();

        // Actualiza el estado del código
        codigoEncontrado.Estado = 'usado';
        codigoEncontrado.usuario = user.id; // Asigna el ID del usuario que usa el código
        codigoEncontrado.FechaUso = nuevoIntento.fecha; // Establece la fecha de uso
        await codigoEncontrado.save();

        // Responde con el nuevo intento, incluyendo el premio si lo tiene
        res.status(201).json({
            nuevoIntento,
            premio: codigoEncontrado.TienePremio ? codigoEncontrado.Premio : null, // Asigna el premio si tiene
        });
    } catch (error) {
        console.error('Error al crear intento:', error);
        res.status(500).json({ error: 'Error al crear intento.' });
    }
};





//Funcion para Obtener los codigos en los que el usuario salio ganador
// Obtener intentos del usuario con premio


export const obtenerIntentosConPremio = async (req, res) => {
    const { user } = req;

    try {
        // Obtener todos los intentos del usuario
        const intentos = await IntentosModel.find({ userId: user.id }).populate('codigo');

        // Filtrar intentos que tengan premio
        const intentosConPremio = await Promise.all(
            intentos.map(async (intento) => {
                const codigo = await Codigo.findOne({ Codigo: intento.codigo });
                return {
                    fecha: intento.fecha,
                    codigo: intento.codigo,
                    premio: codigo.TienePremio ? codigo.Premio : null,
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


