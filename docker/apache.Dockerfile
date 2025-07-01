FROM php:8.1.27-apache

RUN apt-get update && apt-get install -y curl git wget zip && apt-get clean

RUN pecl update-channels

RUN a2enmod rewrite

RUN a2enmod expires

WORKDIR /usr/local/etc/php/conf.d/

COPY docker/config/php/php.ini .

WORKDIR /var/www/html

RUN chown -R www-data:www-data /var/www/html

COPY . .

EXPOSE 80
