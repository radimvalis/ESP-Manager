#ifndef ESP_MANAGER_MQTT_H_
#define ESP_MANAGER_MQTT_H_

#include "esp_manager_priv.h"

#define TOPIC_CMD_UPDATE "cmd/update"
#define TOPIC_CMD_BOOT_DEFAULT "cmd/boot-default"
#define TOPIC_INFO_ONLINE "info/online"
#define TOPIC_INFO_OFFLINE "info/offline"
#define TOPIC_INFO_UPDATE_OK "info/update=ok"
#define TOPIC_INFO_UPDATE_ERROR "info/update=error"

int mqtt_publish(esp_manager_client_handle_t client, const char *topic, const char *data, int qos);

esp_err_t mqtt_start(esp_manager_client_handle_t client);

#endif