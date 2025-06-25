# BFF Dockerfile
FROM node:20.11.1-alpine

WORKDIR /usr/src/app

# Instalar curl
RUN apk add --no-cache curl

# Copiar package.json primeiro
COPY package.json ./

# Instalar dependências
RUN npm install --only=production

# Copiar código da aplicação
COPY . .

# Expor porta
EXPOSE ${BFF_INTERNAL_API_PORT}

# Comando para iniciar a aplicação
CMD ["node", "app.js"]
