FROM node:22-slim
WORKDIR /app
COPY package*.json ./
COPY firebase-adminsdk.json ./firebase-adminsdk.json
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]