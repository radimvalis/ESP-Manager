#ifndef ESP_MANAGER_WIFI_H_
#define ESP_MANAGER_WIFI_H_

#include "esp_manager_priv.h"

#define WIFI_CONNECTED_BIT BIT0

esp_err_t wifi_sta_start(esp_manager_client_handle_t client);

#endif