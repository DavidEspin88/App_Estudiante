# --- ETAPA 1: Construcción (Build) ---
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- ETAPA 2: Producción (Serve) ---
FROM nginx:alpine

# Copiamos los archivos estáticos construidos
COPY --from=builder /app/dist/frontend-angular/browser /usr/share/nginx/html

# NUEVO: Eliminamos la configuración por defecto de Nginx
RUN rm /etc/nginx/conf.d/default.conf

# NUEVO: Copiamos nuestro archivo de configuración personalizado
COPY nginx/default.conf /etc/nginx/conf.d/

EXPOSE 80