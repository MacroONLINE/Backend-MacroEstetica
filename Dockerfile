# Usa una imagen de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de package.json e instala dependencias
COPY package*.json ./
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Genera el cliente de Prisma
RUN npx prisma generate

# Compila el proyecto de NestJS
RUN npm run build

# Expone el puerto que usará la aplicación
EXPOSE 3001

# Comando para iniciar la aplicación en producción y ejecutar migraciones
CMD npx prisma migrate deploy && node dist/src/main
