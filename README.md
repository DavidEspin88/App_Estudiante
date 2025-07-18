#  Sistema de Registro de Estudiantes con Microservicios

Este proyecto es una aplicación web full-stack diseñada para gestionar registros de estudiantes y carreras. Fue construida como un ejercicio práctico para demostrar una arquitectura de microservicios simple, utilizando Node.js para el backend y Angular para el frontend, todo empaquetado con Docker.

---

##  Características Principales

*   **Gestión de Estudiantes (CRUD):**
    *   Listar todos los estudiantes.
    *   Crear nuevos estudiantes, validando la existencia de la carrera.
    *   Actualizar la información de un estudiante.
    *   Eliminar estudiantes.
    *   Búsqueda de estudiantes por nombre en tiempo real.
*   **Gestión de Carreras (CRUD):**
    *   Página dedicada para crear, leer, actualizar y eliminar carreras.
    *   Implementa "Soft Delete" (eliminación lógica) para mantener la integridad de los datos de los estudiantes inscritos.
*   **Arquitectura de Microservicios:**
    *   **estudiantes-service:** Gestiona toda la lógica de los estudiantes.
    *   **carreras-service:** Gestiona toda la lógica de las carreras.
    *   Comunicación síncrona entre servicios (Estudiantes consulta a Carreras).
*   **Contenerización con Docker:**
    *   Todo el sistema (frontend y dos backends) se levanta con un solo comando.
    *   Configuración de Nginx para servir la aplicación de Angular y manejar el enrutamiento de una SPA.

##  Stack Tecnológico

### Frontend
*   [**Angular**](https://angular.io/)
*   [**Angular Material**](https://material.angular.io/) (para componentes de UI)
*   **TypeScript**
*   **HTML & CSS**

### Backend
*   [**Node.js**](https://nodejs.org/)
*   [**Express.js**](https://expressjs.com/) (para las APIs REST)
*   [**Axios**](https://axios-http.com/) (para la comunicación entre servicios)
*   **JavaScript (ES6+)**

### DevOps
*   [**Docker**](https://www.docker.com/)
*   [**Docker Compose**](https://docs.docker.com/compose/) (para la coordinación y control de contenedores)
*   [**Nginx**](https://www.nginx.com/) (como servidor web para el frontend)

---

## Requisitos Previos

Tener instalado el siguiente software en la máquina:

*   [**Node.js**](https://nodejs.org/) (v18 o superior)
*   [**Docker Desktop**](https://www.docker.com/products/docker-desktop/)

---

## Instalación y Ejecución

La forma recomendada y más sencilla de ejecutar este proyecto es a través de Docker.

### 1. Usando Docker (Recomendado)

Desde la carpeta raíz del proyecto (`APP_ESTUDIANTES`), ejecuta el siguiente comando en tu terminal:

bash
```
docker-compose up --build
```

## Si la ejecución es local (manual)
Para ejecutar cada servicio manualmente, necesitará abrir 3 terminales separados con win + ñ en vscode.

*   **Terminal 1: Servicio Carreras**
desde la carpeta principal APP-ESTUDIANTE

*Bash generado:*

```
cd carreras-service

npm install

```
**CODIGO SERVICIO CARRERAS-SERVICE**
```
//carreras-service/index.js

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

// 3. DELETE /carreras/:id - para hacer solo la eliminación lógica (soft delete)
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
```
EJECUTAMOS EL CODIGO EN EL TERMINAL APP_ESTUDIANTE/carreras-service
```
node index.js
``` 

El servicio estará escuchando en ***http://localhost:3001***

*   **Terminal 2: Servicio Estudiantes**
desde la carpeta principal APP-ESTUDIANTE

*Bash generado:*
```
cd estudiantes-service

npm install
```
**CODIGO SERVICIO ESTUDIANTES-SERVICE**
```
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const CARRERAS_SERVICE_URL = 'http://carreras-service:3001/carreras';;

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

```
Desde la RUTA APP-ESTUDIANTE/estudiantes-service
```
node index.js
```
El servicio estará escuchando en **http://localhost:3000**

*   **Terminal 3: Frontend Angular**
desde la carpeta principal APP_ESTUDIANTE
*Bash generado*
```
cd frontend-angular

npm install
```
**CODIGO FRONTIEND-ANGULAR**
   *   APP_ESTUDIANTES\frontend-angular\src\app\components\carreras
 carrera.css
```
//carreras.css
button, input {
  transition: all 0.2s ease-in-out;
}

button:hover {
  transform: translateY(-2px); /* Eleva el botón ligeramente */
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1); /* Sombra más pronunciada */
}

tbody tr:hover {
  background-color: #f9f9f9; /* Un gris muy claro */
}
```
 carreras.html
```
<div class="container">
  <div class="card form-card">
    <h2>{{ idCarreraEditando ? 'Editando Carrera' : 'Nueva Carrera' }}</h2>
    <form (ngSubmit)="guardarCarrera()">
      <div class="form-group">
        <label for="nombreCarrera">Nombre de la Carrera:</label>
        <input type="text" id="nombreCarrera" name="nombreCarrera" [(ngModel)]="carreraEnFormulario.nombre" required>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn-save">{{ idCarreraEditando ? 'Guardar Cambios' : 'Crear Carrera' }}</button>
        <button type="button" class="btn-cancel" *ngIf="idCarreraEditando" (click)="cancelarEdicion()">Cancelar</button>
      </div>
    </form>
  </div>

  <div class="card list-card">
    <h2>Carreras Disponibles</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th class="actions-header">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let carrera of carreras">
          <td>{{ carrera.id }}</td>
          <td>{{ carrera.nombre }}</td>
          <td>
            <button class="btn-edit" (click)="seleccionarParaEditar(carrera)">Editar</button>
            <button class="btn-delete" (click)="eliminarCarrera(carrera.id)">Eliminar</button>
          </td>
        </tr>
        <tr *ngIf="carreras.length === 0">
          <td colspan="3" class="no-data">No hay carreras registradas.</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

```
carreras spect.ts

```
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Carreras } from './carreras';

describe('Carreras', () => {
  let component: Carreras;
  let fixture: ComponentFixture<Carreras>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Carreras]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Carreras);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

```
carreras.ts
```
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@services/api';
import { Carrera } from '@services/interfaces';

@Component({
  selector: 'app-carreras',
  standalone: true,
  imports: [CommonModule, FormsModule], // Añadiremos los módulos de Material después
  templateUrl: './carreras.html',
  styleUrls: ['./carreras.css']
})
export class CarrerasComponent implements OnInit {

  public carreras: Carrera[] = [];
  public carreraEnFormulario: { nombre: string } = { nombre: '' };
  public idCarreraEditando: number | null = null;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.cargarCarreras();
  }

  public cargarCarreras(): void {
    this.apiService.getCarreras().subscribe({
      next: (data) => this.carreras = data,
      error: (err) => console.error('Error al cargar carreras', err)
    });
  }

  public guardarCarrera(): void {
    if (!this.carreraEnFormulario.nombre.trim()) {
      alert('El nombre de la carrera no puede estar vacío.');
      return;
    }

    const onSucesso = () => {
      this.cargarCarreras();
      this.cancelarEdicion();
    };
    const onError = (err: any) => alert(`Error: ${err.error.message || 'Ocurrió un error'}`);

    if (this.idCarreraEditando) {
      this.apiService.updateCarrera(this.idCarreraEditando, this.carreraEnFormulario)
        .subscribe({ next: onSucesso, error: onError });
    } else {
      this.apiService.addCarrera(this.carreraEnFormulario)
        .subscribe({ next: onSucesso, error: onError });
    }
  }

  public seleccionarParaEditar(carrera: Carrera): void {
    this.idCarreraEditando = carrera.id;
    this.carreraEnFormulario = { nombre: carrera.nombre };
  }

  public cancelarEdicion(): void {
    this.idCarreraEditando = null;
    this.carreraEnFormulario = { nombre: '' };
  }

  public eliminarCarrera(id: number): void {
    if (confirm('¿Estás seguro? Al eliminar la carrera, puede afectar a los estudiantes inscritos.')) {
      this.apiService.deleteCarrera(id).subscribe({
        next: () => this.cargarCarreras(),
        error: (err) => alert(`Error al eliminar: ${err.error.message || 'Ocurrió un error'}`)
      });
    }
  }
}
```
APP_ESTUDIANTES\frontend-angular\src\app\components\registro

registro.css
```
.container { 
    font-family: sans-serif; 
    max-width: 800px; 
    margin: auto; 
}
.card { 
    background: #f4f4f4;
    border-radius: 8px; 
    padding: 20px; 
    margin-bottom: 20px; 
    box-shadow: 0 2px 5px rgba(0,0,0,0.1); 
}
.titulo-principal {
  text-align: center;
  margin-bottom: 24px;
}

.titulo-principal h1 {
  font-size: 28px;
  margin: 0;
  color: #2c3e50;
}

.titulo-principal h2 {
  font-size: 20px;
  margin-top: 8px;
  color: #34495e;
}

h2 { 
    color: #333; 
}
.form-group { 
    margin-bottom: 15px; 
}
label {
     display: block; 
     margin-bottom: 5px; 
     font-weight: bold; 
    }
input { 
    width: 95%; 
    padding: 8px; 
    border-radius: 4px; 
    border: 1px solid #ccc;
 }
button { 
    background-color: #007bff; 
    color: white; padding: 10px 15px; 
    border: none; border-radius: 4px; 
    cursor: pointer; 
}
button:hover { 
    background-color: #0056b3; 
}
.info { 
    font-size: 0.8em; 
    color: #666; 
    margin-top: 0; 
}
table { 
    width: 100%;
    border-collapse: collapse; 
}
th, td { 
    text-align: left; 
    padding: 8px; 
    border-bottom: 1px solid #ddd; 
}
th { 
    background-color: #e9e9e9;
 }
 .firma {
  text-align: center;
  margin-top: 32px;
  font-size: 14px;
  color: #555;
}
button, input {
  transition: all 0.2s ease-in-out;
}

button:hover {
  transform: translateY(-2px); /* Eleva el botón ligeramente */
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1); /* Sombra más pronunciada */
}

tbody tr:hover {
  background-color: #f9f9f9; /* Un gris muy claro */
}
```
registro.html
```
<div class="titulo-principal">
  <h1>Universidad Técnica de Manabí</h1>
  <h2>Sistema de Registro de Estudiantes</h2>
</div>

<p *ngIf="modoEdicion">Editando estudiante #{{ estudianteEditando?.id }}</p>

<!-- Formulario de registro / edición -->
<div class="form-group">
  <label for="nombre">Nombre del Estudiante:</label>
  <input
    type="text"
    id="nombre"
    [(ngModel)]="nuevoEstudiante.nombre"
    placeholder="Ej. Juan Pérez"
    required
  />
</div>

<div class="form-group">
  <label for="carrera">Carrera:</label>
  <select
    id="carrera"
    [(ngModel)]="nuevoEstudiante.carreraId"
    required
  >
    <option value="" disabled>Seleccione una carrera</option>
    <option *ngFor="let carrera of carreras" [value]="carrera.id">
      {{ carrera.nombre }}
    </option>
  </select>
</div>

<!-- Botones del formulario -->
<div class="form-group">
  <button *ngIf="!modoEdicion" (click)="registrarEstudiante()">Registrar</button>
  <button *ngIf="modoEdicion" (click)="guardarEdicion()">Guardar</button>
  <button *ngIf="modoEdicion" (click)="resetFormulario()">Cancelar</button>
</div>

<hr />

<h2>Estudiantes Registrados</h2>

<!-- Buscador -->
<div class="form-group">
  <label for="search">Buscar estudiante o carrera:</label>
  <input
    id="search"
    type="text"
    [(ngModel)]="searchTerm"
    placeholder="Ej. Ingeniería o Ana"
  />
</div>

<!-- Tabla de estudiantes -->
<table>
  <thead>
    <tr>
      <th>Ingreso</th>
      <th>Nombre</th>
      <th>Carrera</th>
      <th>Acciones</th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let estudiante of getEstudiantesFiltrados()">
      <td>{{ estudiante.id }}</td>
      <td>{{ estudiante.nombre }}</td>
      <td>{{ estudiante.nombreCarrera }}</td>
      <td>
        <button (click)="iniciarEdicion(estudiante)">Editar</button>
        <button (click)="eliminarEstudiante(estudiante.id)">Eliminar</button>
      </td>
    </tr>
    <tr *ngIf="getEstudiantesFiltrados().length === 0">
      <td colspan="4">No se encontraron estudiantes que coincidan con el criterio.</td>
    </tr>
  </tbody>
</table>
<!-- Firma del desarrollador -->
<footer class="firma">
  <hr />
  <p>Elaborado por <strong>David Espín</strong> como creador del sistema.</p>
</footer>

```
registro.spect.ts
```
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroComponent } from './registro';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';
import { of } from 'rxjs';
import { Estudiante, Carrera } from '../../services/interfaces';

describe('RegistroComponent', () => {
  let component: RegistroComponent;
  let fixture: ComponentFixture<RegistroComponent>;
  let mockApiService: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    const estudiantesMock: Estudiante[] = [
      { id: 1, nombre: 'Juan Pérez', carreraId: 2, nombreCarrera: 'Diseño Gráfico' }
    ];
    const carrerasMock: Carrera[] = [
      { id: 2, nombre: 'Diseño Gráfico' }
    ];

    mockApiService = jasmine.createSpyObj('ApiService', ['getEstudiantes', 'getCarreras', 'addEstudiante']);
    mockApiService.getEstudiantes.and.returnValue(of(estudiantesMock));
    mockApiService.getCarreras.and.returnValue(of(carrerasMock));
    mockApiService.addEstudiante.and.returnValue(of(estudiantesMock[0]));

    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule],
      declarations: [RegistroComponent],
      providers: [
        { provide: ApiService, useValue: mockApiService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load carreras on init', () => {
    expect(component.carreras.length).toBeGreaterThan(0);
    expect(component.carreras[0].nombre).toBe('Diseño Gráfico');
  });

  it('should load estudiantes on init', () => {
    expect(component.estudiantes.length).toBeGreaterThan(0);
    expect(component.estudiantes[0].nombre).toBe('Juan Pérez');
  });
});
```
registro.ts
```
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { Estudiante, Carrera } from '../../services/interfaces';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegistroComponent implements OnInit {
  carreras: Carrera[] = [];
  estudiantes: Estudiante[] = [];
  searchTerm: string = '';
  modoEdicion: boolean = false;
  estudianteEditando: Estudiante | null = null;

  nuevoEstudiante: { nombre: string; carreraId: number | null } = {
    nombre: '',
    carreraId: null
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getCarreras().subscribe({
      next: (data) => this.carreras = data,
      error: (err) => console.error('Error al cargar carreras:', err)
    });
    this.cargarEstudiantes();
  }

  cargarEstudiantes(): void {
    this.apiService.getEstudiantes().subscribe({
      next: (data) => this.estudiantes = data,
      error: (err) => console.error('Error al cargar estudiantes:', err)
    });
  }

  registrarEstudiante(): void {
    if (!this.nuevoEstudiante.nombre || this.nuevoEstudiante.carreraId === null) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    this.apiService.addEstudiante({
      nombre: this.nuevoEstudiante.nombre,
      carreraId: Number(this.nuevoEstudiante.carreraId)
    }).subscribe({
      next: (estudianteCreado) => {
        this.estudiantes.push(estudianteCreado);
        this.resetFormulario();
        setTimeout(() => {
          alert(`${estudianteCreado.nombre} - carrera ${estudianteCreado.nombreCarrera} \n ha sido registrado con éxito`);
        }, 0);
      },
      error: (err) => {
        console.error('Error al registrar estudiante:', err);
        alert('No se pudo registrar el estudiante.');
      }
    });
  }

  iniciarEdicion(est: Estudiante): void {
    this.estudianteEditando = { ...est };
    this.nuevoEstudiante.nombre = est.nombre;
    this.nuevoEstudiante.carreraId = est.carreraId;
    this.modoEdicion = true;
  }

  guardarEdicion(): void {
    if (!this.estudianteEditando || !this.nuevoEstudiante.nombre || this.nuevoEstudiante.carreraId === null) {
      alert('Completa todos los campos para actualizar.');
      return;
    }

    const nombreCarrera = this.carreras.find(c => c.id === this.nuevoEstudiante.carreraId)?.nombre || '';

    const actualizado: Estudiante = {
      ...this.estudianteEditando,
      nombre: this.nuevoEstudiante.nombre,
      carreraId: Number(this.nuevoEstudiante.carreraId),
      nombreCarrera
    };

    this.apiService.updateEstudiante(actualizado).subscribe({
      next: (res) => {
        const index = this.estudiantes.findIndex(e => e.id === res.id);
        if (index !== -1) {
          this.estudiantes[index] = res;
        }
        this.resetFormulario();
        setTimeout(() => {
          alert(`${res.nombre} - carrera ${res.nombreCarrera} \n ha sido modificado correctamente`);
        }, 0);
      },
      error: (err) => {
        console.error('Error al actualizar estudiante:', err);
        alert('No se pudo actualizar el estudiante');
      }
    });
  }

  eliminarEstudiante(id: number): void {
    const eliminado = this.estudiantes.find(e => e.id === id);
    if (!confirm(`¿Seguro que deseas eliminar a ${eliminado?.nombre}?`)) return;

    this.apiService.deleteEstudiante(id).subscribe({
      next: () => {
        this.estudiantes = this.estudiantes.filter(e => e.id !== id);
        setTimeout(() => {
          alert(`${eliminado?.nombre} - carrera ${eliminado?.nombreCarrera} \n ha sido eliminado correctamente`);
        }, 0);
      },
      error: (err) => {
        console.error('Error al eliminar estudiante:', err);
        alert('No se pudo eliminar el estudiante');
      }
    });
  }

  resetFormulario(): void {
    this.nuevoEstudiante = { nombre: '', carreraId: null };
    this.searchTerm = '';
    this.modoEdicion = false;
    this.estudianteEditando = null;
  }

  getEstudiantesFiltrados(): Estudiante[] {
    const term = this.searchTerm.trim().toLowerCase();
    const filtrados = !term
      ? this.estudiantes
      : this.estudiantes.filter(e =>
          e.nombre.toLowerCase().includes(term) ||
          e.nombreCarrera.toLowerCase().includes(term)
        );

    return filtrados.sort((a, b) => a.id - b.id); // orden por ingreso
  }
}
```
APP_ESTUDIANTES\frontend-angular\src\app\services

api.spect.ts
```
import { TestBed } from '@angular/core/testing';

import { Api } from './api';

describe('Api', () => {
  let service: Api;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Api);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

```
api.ts
```
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estudiante, Carrera , EstudiantePayload} from './interfaces';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly estudiantesUrl = 'http://localhost:3000/estudiantes';
  private readonly carrerasUrl = 'http://localhost:3001/carreras';

  constructor(private http: HttpClient) {}

  getEstudiantes(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(this.estudiantesUrl);
  }

  addEstudiante(data: { nombre: string; carreraId: number }): Observable<Estudiante> {
    return this.http.post<Estudiante>(this.estudiantesUrl, data);
  }

  updateEstudiante(data: Estudiante): Observable<Estudiante> {
    return this.http.put<Estudiante>(`${this.estudiantesUrl}/${data.id}`, data);
  }

  deleteEstudiante(id: number): Observable<any> {
    return this.http.delete(`${this.estudiantesUrl}/${id}`);
  }

  getCarreras(): Observable<Carrera[]> {
    return this.http.get<Carrera[]>(this.carrerasUrl);
  }
  
  public addCarrera(data: { nombre: string }): Observable<Carrera> {
    return this.http.post<Carrera>(this.carrerasUrl, data);
  }

  public updateCarrera(id: number, data: { nombre: string }): Observable<Carrera> {
    return this.http.put<Carrera>(`${this.carrerasUrl}/${id}`, data);
  }

  public deleteCarrera(id: number): Observable<void> {
    return this.http.delete<void>(`${this.carrerasUrl}/${id}`);
  }
}

```
interface.ts
```
export interface Carrera {
  id: number;
  nombre: string;
}

export interface Estudiante {
  id: number;
  nombre: string;
  carreraId: number;
  nombreCarrera: string;
}

export type EstudiantePayload = {
  // ...
};
```
APP_ESTUDIANTES\frontend-angular\src\app

app.config.ts
```
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient() // Añadir
  ]
};
```
app.css
```
.main-nav {
  background-color: #333;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}
.main-nav h1 {
  margin: 0;
  font-size: 1.5rem;
}
.main-nav a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  margin-left: 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}
.main-nav a:hover {
  background-color: #555;
}
.main-nav .active-link {
  background-color: #1877f2;
}
.content {
  padding: 1rem; /* Opcional, para dar espacio al contenido */
}
```
app.html
```
<!-- Contenido para src/app/app.component.html -->
<nav class="main-nav">
  <h1>Sistema de Registro</h1>
  <div>
    <!-- Los routerLink nos permiten navegar entre las páginas -->
    <a routerLink="/estudiantes" routerLinkActive="active-link">Gestión de Estudiantes</a>
    <a routerLink="/carreras" routerLinkActive="active-link">Gestión de Carreras</a>
  </div>
</nav>

<main class="content">
  <!--  Angular renderizará el componente de la ruta activa -->
  <router-outlet></router-outlet>
</main>
```
app.routes.ts
```
import { Routes } from '@angular/router';
import { RegistroComponent } from './components/registro/registro';
import { CarrerasComponent } from './components/carreras/carreras';
export const routes: Routes = [
   // Ruta por defecto redirige a la página de estudiantes
  { path: '', redirectTo: '/estudiantes', pathMatch: 'full' },
  // Ruta para la gestión de estudiantes
  { path: 'estudiantes', component: RegistroComponent },
  // NUEVA RUTA para la gestión de carreras
  { path: 'carreras', component: CarrerasComponent },
  // Ruta comodín para páginas no encontradas
  { path: '**', redirectTo: '/estudiantes' }

];

```
app.spects.ts
```
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, frontend-angular');
  });
});
```
app.ts
```
import { Component } from '@angular/core';
import { RouterOutlet,RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'frontend-angular';
}

```
ejecutamos en la terminal principal de Frontend-angular
```
ng serve
```
La aplicación estará disponible en **http://localhost:4200**

# Puntos finales de la API

**Servicio de Estudiantes (http://localhost:3000)**

  * ```GET /estudiantes```: Devuelve todos los estudiantes.
  *  ```GET /estudiantes?nombre=```...: Filtra estudiantes por nombre.
  *  ```POST/estudiantes```:Crea un nuevo estudiante.
  *  ```PUT /estudiantes/:id```: Actualiza un estudiante existente.
  *  ```DELETE /estudiantes/:id```:Elimina a un estudiante.

**Servicio Carreras (http://localhost:3001)**

  *  ```GET /carreras```:Devuelve todas las carreras
  *  ```GET /carreras/:id```: Devuelve una carrera por su ID.
  *  ```POST/carreras```:Crea una nueva carrera.
  *  ```PUT /carreras/:id```: Actualiza una carrera existente.
  * ``` DELETE /carreras/:id```: Marca una carrera como inactiva

