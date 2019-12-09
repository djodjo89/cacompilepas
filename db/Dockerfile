FROM mysql:5.6
COPY ./scripts/init.sql /docker-entrypoint-initdb.d
ENV TZ=Europe/Paris
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
EXPOSE 3306
