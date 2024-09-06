
# BASE STAGE

FROM node:20.11-bullseye-slim AS base

ARG REVERSE_PROXY_CA_CRT

EXPOSE $BACKEND_PORT

RUN apt-get update || : && apt-get install python3 -y python3-pip

RUN pip install esp-idf-nvs-partition-gen

WORKDIR /usr/local/backend

COPY ./backend/package*.json ./

COPY $REVERSE_PROXY_CA_CRT ./ca.crt


# DEVELOPMENT STAGE

FROM base AS dev

RUN npm ci --include=dev

CMD ["npm", "run", "dev"]


# PRODUCTION STAGE

FROM base AS prod

RUN npm ci --omit=dev

COPY ./backend/src ./src

COPY ./backend/data ./data

COPY $REVERSE_PROXY_CA_CRT ./ca.crt

COPY ./shared ../shared

CMD ["npm", "run", "start"]