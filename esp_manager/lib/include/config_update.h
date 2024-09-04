#ifndef ESP_MANAGER_CONFIG_UPDATE_H_
#define ESP_MANAGER_CONFIG_UPDATE_H_

#include "esp_manager_priv.h"

esp_err_t config_update(esp_manager_client_handle_t client, const char *config_url);

#endif