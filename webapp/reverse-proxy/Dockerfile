
# BASE STAGE

FROM nginx:1.25.3 AS base

ARG REVERSE_PROXY_CRT

ARG REVERSE_PROXY_KEY

COPY $REVERSE_PROXY_CRT /etc/ssl/certs/server.crt

COPY $REVERSE_PROXY_KEY /etc/ssl/certs/server.key


# DEVELOPMENT STAGE

FROM base AS dev

COPY ./reverse-proxy/config/dev.conf /etc/nginx/conf.d/default.conf


# BUILD STAGE

FROM node:20.11-bullseye-slim AS build

WORKDIR /usr/local/frontend

COPY    ./frontend/package*.json \
        ./frontend/jsconfig.json \
        ./frontend/vite.config.js \
        ./

COPY ./shared ../shared

RUN npm ci

COPY ./frontend/src ./src

COPY ./frontend/public ./public

COPY ./frontend/index.html ./index.html

RUN npm run build


# PRODUCTION STAGE

FROM base AS prod

COPY ./reverse-proxy/config/prod.conf /etc/nginx/conf.d/default.conf

COPY --from=build /usr/local/frontend/dist /usr/local/frontend
