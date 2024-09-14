FROM docker:24

RUN apk add --update nodejs npm

WORKDIR /api

COPY . .

RUN npm i

ENTRYPOINT [ "node", "." ]