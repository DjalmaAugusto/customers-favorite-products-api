FROM node:alpine

WORKDIR /usr/app

ADD package.json .
ADD . .

COPY . .

EXPOSE 3000

CMD npm start