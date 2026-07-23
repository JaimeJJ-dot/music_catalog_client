# ==========================================
# ETAPA 1: Construcción (Builder)
# ==========================================
FROM node:18-alpine as builder

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar dependencias e instalarlas
COPY package*.json ./
RUN npm install

# Copiar el código fuente y compilar la aplicación para producción
COPY . .
RUN npm run build

# ==========================================
# ETAPA 2: Servidor Web (Nginx)
# ==========================================
FROM nginx:alpine

# Copiar los archivos estáticos generados en la Etapa 1 al servidor Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer el puerto por defecto de Nginx
EXPOSE 80

# Comando para iniciar Nginx y mantenerlo ejecutándose en primer plano
CMD ["nginx", "-g", "daemon off;"]