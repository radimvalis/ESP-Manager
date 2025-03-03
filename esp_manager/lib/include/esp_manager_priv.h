#ifndef ESP_MANAGER_PRIV_H_
#define ESP_MANAGER_PRIV_H_

#include "esp_manager.h"
#include <stdbool.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "mqtt_client.h"

#define NULL_CHECK(x, action) if(!(x)) { action; }

#define ERROR_CHECK(x, action) if((x) != ESP_OK) { action; }

#define DEFAULT_FIRMWARE_ID "default"
#define DEFAULT_FIRMWARE_VERSION -1

typedef enum {

    STATE_CONNECT_WIFI,
    STATE_CONNECT_MQTT,
    STATE_RUN
} esp_manager_client_state_t;

typedef enum {

    EVENT_WIFI_CONNECTED,
    EVENT_MQTT_CONNECTED,
    EVENT_MQTT_ERROR,
    EVENT_UPDATE,
    EVENT_BOOT_DEFAULT
} esp_manager_event_id_t;

typedef struct {

    esp_manager_event_id_t id;
    void *data;
} esp_manager_event_t;

struct esp_manager_client {

    char *id;
    char *wifi_ssid;
    char *wifi_password;
    char *http_password;
    char *mqtt_password;
    char *mqtt_broker_uri;
    char *server_crt;
    TaskHandle_t task_handle;
    QueueHandle_t queue_handle;
    esp_mqtt_client_handle_t mqtt_handle;
    esp_manager_client_state_t state;
    bool is_running;
};

#endif