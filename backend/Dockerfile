FROM node:18-alpine

RUN addgroup -S app && adduser -S app -G app

WORKDIR /app

# Crée le dossier data et donne les droits
RUN mkdir -p /app/data && chown -R app:app /app/data

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

ENV NODE_ENV=production
EXPOSE 3000

USER app
CMD ["node", "index.js"]
