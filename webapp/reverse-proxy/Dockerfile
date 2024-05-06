
# DEVELOPMENT STAGE

FROM nginx:1.25.3 AS dev

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

FROM nginx:1.25.3 AS prod

COPY ./reverse-proxy/config/prod.conf /etc/nginx/conf.d/default.conf

COPY --from=build /usr/local/frontend/dist /usr/local/frontend
