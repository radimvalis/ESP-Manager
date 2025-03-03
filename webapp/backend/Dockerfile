
# BASE STAGE

FROM node:20.11-bullseye-slim AS base

ARG CA_BUNDLE

EXPOSE $BACKEND_PORT

RUN apt-get update || : && apt-get install python3 -y python3-pip

RUN pip install esp-idf-nvs-partition-gen

WORKDIR /usr/local/backend

COPY ./backend/package*.json ./

COPY $CA_BUNDLE ./ca-bundle.crt

# DEVELOPMENT STAGE

FROM base AS dev

RUN npm ci --include=dev

CMD ["npm", "run", "dev"]


# PRODUCTION STAGE

FROM base AS prod

RUN npm ci --omit=dev

COPY ./backend/src ./src

COPY ./backend/data ./data

COPY $CA_BUNDLE ./ca-bundle.crt

COPY ./shared ../shared

CMD ["npm", "run", "start"]