# api/Dockerfile
FROM node:20.11.1

WORKDIR /usr/src/app

# Instalar curl
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE ${BFF_INTERNAL_PORT}

CMD ["node", "app.js"]
