// 1. Importar Express
const express = require('express');
const cors = require('cors');

// 2. Crear una instancia de Express
const app = express();

// 3. Definir el puerto. Usaremos uno diferente para cada servicio.
const PORT = 3001;

// Middleware para que nuestro servidor entienda JSON
app.use(cors());
app.use(express.json());

// 4. Datos de ejemplo (en un proyecto real, esto vendría de una base de datos)
const carreras = [
    { id: 1, nombre: 'Ingeniería de Software' },
    { id: 2, nombre: 'Medicina' },
    { id: 3, nombre: 'Diseño Gráfico' }
];
let nextId = 4; // Para generar IDs para nuevas carreras
// 5. Definir nuestras rutas (endpoints)

// GET /carreras - Devuelve todas las carreras
app.get('/carreras', (req, res) => {
    res.json(carreras);
});

// GET /carreras/:id - Devuelve una carrera específica por su ID
app.get('/carreras/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const carrera = carreras.find(c => c.id === id);

    if (carrera) {
        res.json(carrera);
    } else {
        res.status(404).send('Carrera no encontrada');
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
        nombre: nombre
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

// DELETE /carreras/:id - Elimina una carrera
app.delete('/carreras/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const carreraIndex = carreras.findIndex(c => c.id === id);

    if (carreraIndex === -1) {
        return res.status(404).json({ message: 'Carrera no encontrada' });
    }
    
    carreras.splice(carreraIndex, 1);
    console.log(`Carrera con id ${id} eliminada.`);
    res.status(204).send();
});

// 6. Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Carreras-Service escuchando en el puerto ${PORT}`);
});