FROM node:latest

WORKDIR /app

COPY . .

RUN npm i

CMD ["npm", "start"]

EXPOSE 5000