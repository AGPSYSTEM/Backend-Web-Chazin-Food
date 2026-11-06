FROM node:20-alpine

WORKDIR /app

# Copiar manifests de dependencias
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --omit=dev

# Copiar el código del backend
COPY . .

EXPOSE 5000

CMD ["npm", "start"]
