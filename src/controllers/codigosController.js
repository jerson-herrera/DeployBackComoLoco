import CodigoModel from '../models/codigos.js'; // Asegúrate de que la ruta sea correcta
import UserInfoModel from "../models/userInfo.js"

// Funcion para crear los 1000 códigos
export const createCodes = async (req, res) => {
    try {
        const { total = 1000, totalPremios = 400 } = req.body;

        // Validaciones básicas
        if (totalPremios > total) {
            return res.status(400).json({ error: 'El número de premios no puede ser mayor al total de códigos.' });
        }

        // Definición de premios y sus cantidades
        const premios = [
            { premio: 1000000, cantidad: 50 },   // 50 códigos con premio de 1.000.000
            { premio: 50000, cantidad: 150 },     // 150 códigos con premio de 50.000
            { premio: 10000, cantidad: 200 },     // 200 códigos con premio de 10.000
        ];

        // Crear un arreglo que contendrá los premios
        const premiosArray = [];
        for (const { premio, cantidad } of premios) {
            for (let i = 0; i < cantidad; i++) {
                premiosArray.push(premio);
            }
        }

        // Barajar el arreglo de premios
        for (let i = premiosArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [premiosArray[i], premiosArray[j]] = [premiosArray[j], premiosArray[i]]; // Intercambiar
        }

        // Crear un arreglo para los códigos
        const codigos = [];

        // Generar los códigos
        for (let i = 1; i <= total; i++) {
            codigos.push({
                Codigo: i.toString().padStart(4, '0'), // Formato: '0001', '0002', ...
                TienePremio: false, // Inicialmente, no tiene premio
                Premio: null, // Inicialmente, no tiene premio
            });
        }

        // Asignar premios aleatoriamente
        for (let i = 0; i < totalPremios; i++) {
            let codigoAleatorio = Math.floor(Math.random() * total); // Obtener un índice aleatorio
            while (codigos[codigoAleatorio].TienePremio) { // Si ya tiene premio, busca otro
                codigoAleatorio = Math.floor(Math.random() * total);
            }

            // Asignar premio
            codigos[codigoAleatorio].TienePremio = true;
            codigos[codigoAleatorio].Premio = `Premio de ${premiosArray[i]}`; // Asignar el premio
        }

        // Insertar los códigos en la base de datos
        await CodigoModel.insertMany(codigos);

        res.status(201).json({ message: 'Códigos generados exitosamente', totalCodigos: total });
    } catch (error) {
        console.error('Error al crear los códigos:', error);
        res.status(500).json({ error: 'Error del servidor al crear los códigos' });
    }
};

//Funcion para obtener los codigos que Tienen Premio

export const getPremiados = async (req, res) => {
    try {
        const codigosPremiados = await CodigoModel.find({ TienePremio: true });

        if (codigosPremiados.length === 0) {
            return res.status(404).json({ message: 'No hay códigos premiados.' });
        }

        res.status(200).json(codigosPremiados);
    } catch (error) {
        console.error('Error al obtener los códigos premiados:', error);
        res.status(500).json({ error: 'Error del servidor al obtener los códigos premiados' });
    }
};



//Funcion para obtener todos los codigos 
export const getAllCodes = async (req, res) => {
    try {
        const codigos = await CodigoModel.find({});
        console.log(codigos); // Imprime todos los códigos para depurar
        res.status(200).json(codigos);
    } catch (error) {
        console.error('Error al obtener los códigos:', error);
        res.status(500).json({ error: 'Error del servidor al obtener los códigos' });
    }
};



//Funcion para mostrar la informacion del ADMIN
  export const obtenerUsersGanadores = async (req, res) => {
    try {
      // Buscar los códigos ganadores usados y poblar los datos del usuario
      const codigosGanadores = await CodigoModel.find({
        Estado: 'usado',
        TienePremio: true,
      }).populate({
        path: 'usuario', // Poblamos el campo 'usuario'
        model: UserInfoModel, // Aseguramos la referencia correcta al modelo UserInfo
        select: 'Nombre Cedula Celular Correo Ciudad', // Seleccionamos los campos necesarios
        options: { strictPopulate: false }, // Evitamos fallos con la referencia
      });
  
      if (!codigosGanadores.length) {
        return res.status(404).json({ message: 'No hay códigos ganadores usados.' });
      }
  
      res.status(200).json(codigosGanadores);
    } catch (error) {
      console.error('Error al obtener los códigos ganadores:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };