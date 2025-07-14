const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const CARRERAS_SERVICE_URL = 'http://localhost:3001/carreras';

let estudiantes = [
    { id: 1, nombre: 'Juan Perez', carreraId: 1, nombreCarrera: 'Ingeniería de Software' }
];

// GET
app.get('/estudiantes', (req, res) => {
    res.json(estudiantes);
});

// POST
app.post('/estudiantes', async (req, res) => {
    const { nombre, carreraId } = req.body;
    if (!nombre || !carreraId) return res.status(400).send('Nombre y carreraId son requeridos');

    try {
        const response = await axios.get(`${CARRERAS_SERVICE_URL}/${carreraId}`);
        const nombreCarrera = response.data.nombre;

        const nuevoEstudiante = {
            id: estudiantes.length + 1,
            nombre,
            carreraId,
            nombreCarrera
        };

        estudiantes.push(nuevoEstudiante);
        res.status(201).json(nuevoEstudiante);
    } catch (error) {
        if (error.response?.status === 404) {
            res.status(400).send(`La carrera con ID ${carreraId} no existe.`);
        } else {
            console.error("Error:", error.message);
            res.status(500).send('Error al contactar el servicio de carreras.');
        }
    }
});

// PUT
app.put('/estudiantes/:id', async (req, res) => {
    const estudianteId = parseInt(req.params.id, 10);
    const { nombre, carreraId } = req.body;

    if (!nombre || !carreraId) return res.status(400).send('Nombre y carreraId son requeridos');

    try {
        const response = await axios.get(`${CARRERAS_SERVICE_URL}/${carreraId}`);
        const nombreCarrera = response.data.nombre;

        const index = estudiantes.findIndex(e => e.id === estudianteId);
        if (index === -1) return res.status(404).send('Estudiante no encontrado');

        estudiantes[index] = {
            id: estudianteId,
            nombre,
            carreraId,
            nombreCarrera
        };

        res.json(estudiantes[index]);
    } catch (error) {
        if (error.response?.status === 404) {
            res.status(400).send(`La carrera con ID ${carreraId} no existe.`);
        } else {
            console.error("Error:", error.message);
            res.status(500).send('Error al actualizar estudiante.');
        }
    }
});
app.delete('/estudiantes/:id', (req, res) => {
  const estudianteId = parseInt(req.params.id, 10);
  const index = estudiantes.findIndex(e => e.id === estudianteId);

  if (index === -1) {
    return res.status(404).send('Estudiante no encontrado');
  }

  estudiantes.splice(index, 1);
  console.log(`Estudiante ${estudianteId} eliminado`);
  res.status(204).send(); // Sin contenido
});

app.listen(PORT, () => {
    console.log(`Estudiantes-Service escuchando en el puerto ${PORT}`);
});
