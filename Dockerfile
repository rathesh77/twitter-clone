FROM node:latest

WORKDIR /app

COPY ./ .

RUN npm install

RUN npm run sass-compile

CMD [ "npm", "start" ]