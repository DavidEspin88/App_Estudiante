// Contenido CORREGIDO Y COMPLETO para carreras-service/index.js

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// 1. AÑADIMOS la propiedad 'activa: true' a los datos iniciales
let carreras = [
    { id: 1, nombre: 'Ingeniería de Software', activa: true },
    { id: 2, nombre: 'Medicina', activa: true },
    { id: 3, nombre: 'Diseño Gráfico', activa: true }
];
let nextId = 4;

// --- RUTAS CRUD ---

// 2. GET /carreras - UNA SOLA VEZ, y filtra por estado activo
app.get('/carreras', (req, res) => {
    // Filtramos para devolver solo las carreras que están marcadas como activas
    const carrerasActivas = carreras.filter(c => c.activa === true);
    res.json(carrerasActivas);
});

// GET /carreras/:id - Devuelve una carrera por ID (sin importar si está activa o no)
// Esto es importante para que los estudiantes antiguos puedan seguir validando su carrera.
app.get('/carreras/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const carrera = carreras.find(c => c.id === id);
    if (carrera) {
        res.json(carrera);
    } else {
        res.status(404).json({ message: 'Carrera no encontrada' });
    }
});

// POST /carreras - Crea una nueva carrera
app.post('/carreras', (req, res) => {
    const { nombre } = req.body;
    if (!nombre) {
        return res.status(400).json({ message: 'El nombre es requerido' });
    }
    const nuevaCarrera = {
        id: nextId++,
        nombre: nombre,
        activa: true // Las nuevas carreras siempre se crean como activas
    };
    carreras.push(nuevaCarrera);
    console.log('Nueva carrera creada:', nuevaCarrera);
    res.status(201).json(nuevaCarrera);
});

// PUT /carreras/:id - Actualiza una carrera
app.put('/carreras/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { nombre } = req.body;
    const carreraIndex = carreras.findIndex(c => c.id === id);

    if (carreraIndex === -1) {
        return res.status(404).json({ message: 'Carrera no encontrada' });
    }
    if (!nombre) {
        return res.status(400).json({ message: 'El nombre es requerido' });
    }
    carreras[carreraIndex].nombre = nombre;
    console.log('Carrera actualizada:', carreras[carreraIndex]);
    res.json(carreras[carreraIndex]);
});

// 3. DELETE /carreras/:id - Corregido para hacer solo la eliminación lógica (soft delete)
app.delete('/carreras/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const carreraIndex = carreras.findIndex(c => c.id === id);

    // Validamos PRIMERO si la carrera existe
    if (carreraIndex === -1) {
        return res.status(404).json({ message: 'Carrera no encontrada' });
    }
    
    // Cambiamos su estado a inactivo en lugar de borrarla
    carreras[carreraIndex].activa = false;
    console.log(`Carrera con id ${id} marcada como inactiva.`);
    res.status(204).send(); // Enviamos respuesta exitosa
});

// --- INICIAR SERVIDOR ---
app.listen(PORT, () => {
    console.log(`Carreras-Service (con soft-delete) escuchando en el puerto ${PORT}`);
});