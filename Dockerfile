# Usa una imagen de Node.js basada en Alpine
FROM node:18-alpine

# Instala OpenSSL y OpenSSH
RUN apk update && apk add --no-cache openssl openssh

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de package.json e instala dependencias
COPY package*.json ./
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Copia la clave pública SSH desde las variables de entorno
RUN mkdir -p ~/.ssh && echo "$SSH_PUBLIC_KEY" > ~/.ssh/authorized_keys

# Genera el cliente de Prisma
RUN npx prisma generate

# Compila el proyecto de NestJS
RUN npm run build

# Expone el puerto que usará la aplicación
EXPOSE 3001

# Comando para iniciar la aplicación en producción y ejecutar migraciones
CMD npx prisma migrate deploy && node dist/src/main
