#include "esp_manager.h"
#include <stdio.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_log.h"

static const char *TAG = "esp-manager";

void app_main(void)
{
    esp_manager_client_handle_t esp_manager = esp_manager_init();

    if (esp_manager) {

        ESP_LOGI(TAG, "ESP Manager was initialized!");

        esp_err_t err = esp_manager_start(esp_manager);

        if (err == ESP_OK) {

            while (1) {

                vTaskDelay(5000 / portTICK_PERIOD_MS);

                ESP_LOGI(TAG, "Default app ...");
            }
        }

        ESP_LOGE(TAG, "ESP Manager failed to start!");
    }

    else {

        ESP_LOGE(TAG, "Initialization of ESP Manager failed!");
    }
}
