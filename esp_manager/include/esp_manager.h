#ifndef ESP_MANAGER_H_
#define ESP_MANAGER_H_

#include "esp_err.h"

typedef struct esp_manager_client *esp_manager_client_handle_t;

esp_manager_client_handle_t esp_manager_init(void);

esp_err_t esp_manager_start(esp_manager_client_handle_t client);

esp_err_t esp_manager_destroy(esp_manager_client_handle_t client);

#endif
