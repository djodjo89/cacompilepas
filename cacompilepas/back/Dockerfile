FROM php:7.4-fpm-alpine
RUN docker-php-ext-install pdo pdo_mysql
RUN printf '[PHP]\ndate.timezone = "Europe/Paris"\n' > /usr/local/etc/php/conf.d/tzone.ini
CMD [ "php-fpm"]
EXPOSE 9000
