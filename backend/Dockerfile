FROM node:20-alpine

WORKDIR /usr/app

COPY package.json ./

RUN npm install

COPY . .

ARG MONGO_URI

ENV MONGO_URI=$MONGO_URI

RUN echo "MONGO_URI=${MONGO_URI}" > .env && echo "PORT=3333" >> .env

RUN npm run build

EXPOSE 3333

CMD ["node", "dist/src/main"]
