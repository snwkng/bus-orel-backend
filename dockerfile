# этап сборки (build stage)
FROM node:20.11.1-alpine3.19
WORKDIR /app
COPY package*.json ./
RUN npm install

# ARG NODE_ENV=production
ARG NODE_ENV=development
ENV PORT='3001'
COPY . .
# RUN npm start:dev

EXPOSE 3001
CMD ["npm", "run", "start:dev"]
