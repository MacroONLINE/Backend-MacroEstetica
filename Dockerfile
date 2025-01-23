# Usa una imagen de Node.js basada en Alpine
FROM node:18-alpine

# Instala OpenSSL, OpenSSH y OpenRC
RUN apk update && apk add --no-cache openssl openssh openrc

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de package.json e instala dependencias
COPY package*.json ./
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Copia la clave pública SSH directamente en el Dockerfile
RUN mkdir -p ~/.ssh && echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPiQuJwmyw2M1Sv7TO95qDyQjKHxkoRZdFTrMe6JVS15 mac@MacBook-Pro-de-MAC.local" > ~/.ssh/authorized_keys

# Establece los permisos adecuados para el archivo authorized_keys y el directorio .ssh
RUN chmod 600 ~/.ssh/authorized_keys && chmod 700 ~/.ssh

# Habilita el servicio SSH
RUN rc-update add sshd default

# Genera el cliente de Prisma
RUN npx prisma generate

# Compila el proyecto de NestJS
RUN npm run build

# Expone el puerto que usará la aplicación
EXPOSE 3001

# Comando para iniciar el servidor SSH, ejecutar migraciones y iniciar la aplicación
CMD ["sh", "-c", "rc-service sshd start && npx prisma migrate deploy && node dist/src/main"]
