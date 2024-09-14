FROM node:hydrogen-alpine

WORKDIR /ui

COPY . .

RUN npm i

ENTRYPOINT [ "npm", "run", "dev" ]