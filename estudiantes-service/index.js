// 1. Importar dependencias
const express = require('express');
const axios = require('axios'); // Para hacer peticiones a otros servicios

// 2. Crear instancia de Express
const app = express();
const PORT = 3000; // ¡Un puerto diferente!

// Middleware para entender JSON
app.use(express.json());

// URL de nuestro servicio de carreras
const CARRERAS_SERVICE_URL = 'http://localhost:3001/carreras';

// 3. Datos de ejemplo
let estudiantes = [
    { id: 1, nombre: 'Juan Perez', carreraId: 1, nombreCarrera: 'Ingeniería de Software' }
];

// 4. Definir nuestras rutas

// GET /estudiantes - Devuelve todos los estudiantes
app.get('/estudiantes', (req, res) => {
    res.json(estudiantes);
});

// POST /estudiantes - Crea un nuevo estudiante
app.post('/estudiantes', async (req, res) => {
    const { nombre, carreraId } = req.body;

    if (!nombre || !carreraId) {
        return res.status(400).send('Nombre y carreraId son requeridos');
    }

    try {
        // ---- ¡AQUÍ OCURRE LA MAGIA! ----
        // Hacemos una petición al servicio de carreras para obtener los detalles
        const response = await axios.get(`${CARRERAS_SERVICE_URL}/${carreraId}`);
        
        // Si la petición es exitosa, la carrera existe.
        const nombreCarrera = response.data.nombre;

        const nuevoEstudiante = {
            id: estudiantes.length + 1,
            nombre: nombre,
            carreraId: carreraId,
            nombreCarrera: nombreCarrera // Guardamos el nombre de la carrera
        };

        estudiantes.push(nuevoEstudiante);
        console.log('Nuevo estudiante registrado:', nuevoEstudiante);
        res.status(201).json(nuevoEstudiante);

    } catch (error) {
        // Si axios da un error, puede ser porque la carrera no existe (404)
        // o porque el otro servicio está caído.
        if (error.response && error.response.status === 404) {
            res.status(400).send(`La carrera con ID ${carreraId} no existe.`);
        } else {
            console.error("Error al contactar Carreras-Service:", error.message);
            res.status(500).send('Error al contactar el servicio de carreras.');
        }
    }
});

// 5. Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Estudiantes-Service escuchando en el puerto ${PORT}`);
});