
# DEVELOPMENT STAGE

FROM node:20.11-bullseye-slim AS dev

EXPOSE $FRONTEND_PORT

WORKDIR /usr/local/frontend

COPY    ./frontend/package*.json \
        ./frontend/jsconfig.json \
        ./frontend/vite.config.js \
        ./

RUN npm ci --include=dev

CMD ["npm", "run", "dev"]