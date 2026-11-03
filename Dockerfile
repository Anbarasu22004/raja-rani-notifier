FROM node:22-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY *.js ./
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/service-account.json
CMD ["node", "index.js"]
