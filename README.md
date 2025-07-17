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
*   [**Docker Compose**](https://docs.docker.com/compose/) (para la orquestación de los contenedores)
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
docker-compose up --build

## Si la ejecución es local (manual)
Para ejecutar cada servicio manualmente, necesitará abrir 3 terminales separados con win + ñ en vscode.

*   **Terminal 1: Servicio Carreras**
desde la carpeta principal APP-ESTUDIANTE

*Bash generado:*

```
cd carreras-service

npm install

node index.js
```

El servicio estará escuchando en ***http://localhost:3001***

*   **Terminal 2: Servicio Estudiantes**
desde la carpeta principal APP-ESTUDIANTE

*Bash generado:*
```

cd estudiantes-service

npm install

node index.js
```
El servicio estará escuchando en **http://localhost:3000**

*   **Terminal 3: Frontend Angular**
desde la carpeta principal APP-ESTUDIANTE
*Bash generado*
```
cd frontend-angular

npm install

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

