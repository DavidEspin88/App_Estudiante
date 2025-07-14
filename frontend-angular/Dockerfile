# --- ETAPA 1: Construcción (Build) ---
# Usamos una imagen de Node para tener acceso a npm y Angular CLI
FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Este comando compila la app y la deja en /app/dist/frontend-angular/browser
RUN npm run build

# --- ETAPA 2: Producción (Serve) ---
# Usamos una imagen súper ligera de Nginx para servir los archivos
FROM nginx:alpine

# Copiamos los archivos estáticos construidos en la etapa anterior
# a la carpeta donde Nginx sirve contenido por defecto.
COPY --from=builder /app/dist/frontend-angular/browser /usr/share/nginx/html

# Exponemos el puerto 80, que es el que Nginx usa por defecto
EXPOSE 80

# Cuando el contenedor inicie, Nginx se iniciará automáticamente.