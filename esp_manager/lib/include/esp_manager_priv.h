#ifndef ESP_MANAGER_PRIV_H_
#define ESP_MANAGER_PRIV_H_

#include "esp_manager.h"
#include <stdbool.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/event_groups.h"
#include "mqtt_client.h"

#define NULL_CHECK(x, action) if(!(x)) { action; }

#define ERROR_CHECK(x, action) if((x) != ESP_OK) { action; }

#define WIFI_CONNECTED_BIT  BIT0
#define MQTT_CONNECTED_BIT  BIT1
#define MQTT_FAIL_BIT       BIT2

typedef enum {

    STATE_CONNECT_WIFI,
    STATE_CONNECT_MQTT,
    STATE_RUN
} esp_manager_client_state_t;

struct esp_manager_client {

    char* wifi_ssid;
    char* wifi_password;
    char* mqtt_username;
    char* mqtt_password;
    char* mqtt_broker_uri;
    TaskHandle_t task_handle;
    esp_mqtt_client_handle_t mqtt_handle;
    EventGroupHandle_t event_group_handle;
    esp_manager_client_state_t state;
    bool is_running;
};

#endif