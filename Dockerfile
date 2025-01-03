FROM node:20-alpine
LABEL maintainer="TuNombre <tuemail@example.com>"

# Instalar PM2 para producción
RUN npm install pm2 -g

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos necesarios
COPY package*.json ./
COPY tsconfig*.json ./
COPY .env ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY ./src ./src

# Construir el proyecto
RUN npm run build

# Exponer puertos
EXPOSE 3000

# Iniciar la aplicación con PM2
CMD ["pm2-runtime", "start", "pm2.json"]
