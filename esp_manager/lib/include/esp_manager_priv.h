#ifndef ESP_MANAGER_PRIV_H_
#define ESP_MANAGER_PRIV_H_

#include "esp_manager.h"
#include <stdbool.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/event_groups.h"

#define NULL_CHECK(x, action) if(!(x)) { action; }

#define ERROR_CHECK(x, action) if((x) != ESP_OK) { action; }

typedef enum {

    STATE_CONNECT_WIFI,
    STATE_RUN
} esp_manager_client_state_t;

struct esp_manager_client {

    char* id;
    char* ssid;
    char* password;
    TaskHandle_t task_handle;
    EventGroupHandle_t event_group_handle;
    esp_manager_client_state_t state;
    bool is_running;
};

#endif