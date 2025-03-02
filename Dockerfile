FROM node:18-alpine

WORKDIR /app

RUN apk add yarn && yarn

RUN apk update --no-cache && apk add --no-cache bash

ENV DOCKERIZE_VERSION v0.9.2

RUN apk update --no-cache \
    && apk add --no-cache wget openssl \
    && wget -O - https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz | tar xzf - -C /usr/local/bin \
    && apk del wget

EXPOSE 3000