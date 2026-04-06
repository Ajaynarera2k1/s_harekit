FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

RUN mkdir -p storage/files storage/pictures

ENV NODE_ENV=production
EXPOSE 8080

CMD ["npm", "start"]

