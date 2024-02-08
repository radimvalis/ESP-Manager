
#!/bin/bash

if [ "$1" == "--dev" ]; then

    docker compose --env-file .env --env-file .env.dev up --build

else

    docker compose -f compose.yaml --env-file .env --env-file .env.prod up --build

fi
