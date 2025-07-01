FROM node:20.18.1-alpine

WORKDIR /var/www/html

COPY . .

ENTRYPOINT [ "npm" ]