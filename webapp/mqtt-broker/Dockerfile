
# DEVELOPMENT STAGE

FROM eclipse-mosquitto as dev

ARG MQTT_BROKER_CRT
ARG MQTT_BROKER_KEY

ARG MQTT_ADMIN_USERNAME
ARG MQTT_ADMIN_PASSWORD

COPY $MQTT_BROKER_CRT /mosquitto/certs/broker.crt
COPY $MQTT_BROKER_KEY /mosquitto/certs/broker.key

RUN mosquitto_ctrl dynsec init /mosquitto/config/dynamic-security.json $MQTT_ADMIN_USERNAME $MQTT_ADMIN_PASSWORD


# PRODUCTION STAGE

FROM dev as prod

COPY ./mqtt-broker/mosquitto.conf /mosquitto/config/mosquitto.conf