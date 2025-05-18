# Fase de construcción
FROM node:18-alpine as build

WORKDIR /app

# Copiar los archivos de package*.json primero para aprovechar la caché de Docker
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código
COPY . .

# Construir la aplicación
RUN npm run build

# Fase de producción
FROM nginx:stable-alpine

# Copiar la configuración de nginx personalizada si es necesario
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos de construcción a la imagen de nginx
COPY --from=build /app/dist /usr/share/nginx/html

# El contenedor expone el puerto 80
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
