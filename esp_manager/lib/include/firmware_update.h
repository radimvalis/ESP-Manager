#ifndef ESP_MANAGER_FIRMWARE_UPDATE_H_
#define ESP_MANAGER_FIRMWARE_UPDATE_H_

#include "esp_manager_priv.h"

esp_err_t set_factory_as_boot_partition();

esp_err_t firmware_update(esp_manager_client_handle_t client, const char *firmware_url);

#endif