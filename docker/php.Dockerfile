FROM php:8.1.27-cli

RUN apt-get update && apt-get install -y curl git wget zip && apt-get clean

RUN pecl update-channels

RUN docker-php-ext-install pdo pdo_mysql bcmath sockets opcache && docker-php-ext-enable opcache && pecl install apcu && docker-php-ext-enable apcu

RUN docker-php-ext-install mysqli

WORKDIR /usr/local/etc/php/conf.d/

COPY docker/config/php/php.ini .

WORKDIR /var/www/html

RUN chown -R www-data:www-data /var/www/html

COPY . .

ENTRYPOINT [ "php"]
