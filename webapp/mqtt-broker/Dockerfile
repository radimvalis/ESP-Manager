
# DEVELOPMENT STAGE

FROM eclipse-mosquitto as dev


# PRODUCTION STAGE

FROM dev as prod

COPY ./mqtt-broker/mosquitto.conf /mosquitto/config/mosquitto.conf