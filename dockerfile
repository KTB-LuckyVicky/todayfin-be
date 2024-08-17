FROM node:22.5-alpine

WORKDIR /app

COPY package*.json ./.

RUN npm install -g pnpm

RUN pnpm install

COPY . .

EXPOSE 5000

CMD ["pnpm","start"]

