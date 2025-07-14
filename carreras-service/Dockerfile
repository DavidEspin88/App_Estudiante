# Usamos una imagen oficial de Node.js ligera
FROM node:18-alpine

# Creamos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos package.json y package-lock.json para aprovechar el cache de Docker
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código de nuestra aplicación
COPY . .

# Exponemos el puerto que usa nuestro servicio
EXPOSE 3001

# El comando para iniciar la aplicación cuando el contenedor arranque
CMD [ "node", "index.js" ]