
# DEVELOPMENT STAGE

FROM eclipse-mosquitto as dev

ARG MQTT_ADMIN_USERNAME

ARG MQTT_ADMIN_PASSWORD

RUN mosquitto_ctrl dynsec init /mosquitto/config/dynamic-security.json $MQTT_ADMIN_USERNAME $MQTT_ADMIN_PASSWORD


# PRODUCTION STAGE

FROM dev as prod

COPY ./mqtt-broker/mosquitto.conf /mosquitto/config/mosquitto.conf