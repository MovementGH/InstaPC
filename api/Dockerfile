FROM docker:24

RUN apk add --update nodejs npm

COPY . .

RUN npm i

ENTRYPOINT [ "node", "." ]