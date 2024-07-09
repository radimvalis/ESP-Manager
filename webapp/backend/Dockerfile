
# BASE STAGE

FROM node:20.11-bullseye-slim AS base

EXPOSE $BACKEND_PORT

WORKDIR /usr/local/backend

COPY ./backend/package*.json ./


# DEVELOPMENT STAGE

FROM base AS dev

RUN npm ci --include=dev

CMD ["npm", "run", "dev"]


# PRODUCTION STAGE

FROM base AS prod

RUN npm ci --omit=dev

COPY ./backend/src ./src

COPY ./backend/data ./data

COPY ./shared ../shared

CMD ["npm", "run", "start"]