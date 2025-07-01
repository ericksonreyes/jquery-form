FROM node:20.18.1-alpine

WORKDIR /var/www/html

COPY . .

RUN npm install

RUN npm install --global gulp-cli

CMD ["gulp", "watch"]
