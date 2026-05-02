FROM node:20-slim

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY prisma ./prisma

RUN npx prisma generate

COPY src ./src

EXPOSE 3000

CMD ["node", "src/index.js"]