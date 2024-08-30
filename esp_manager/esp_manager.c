#include "esp_manager_priv.h"
#include "wifi.h"
#include "mqtt.h"
#include "esp_log.h"
#include "nvs_flash.h"
#include "esp_heap_caps.h"

static char *nvs_get_str_ptr(nvs_handle_t handle, char *key)
{
    char *ret;
    size_t ret_length;
    esp_err_t err;

    err = nvs_get_str(handle, key, NULL, &ret_length);
    ERROR_CHECK(err, return NULL);

    ret = malloc(ret_length);
    NULL_CHECK(ret, return NULL);

    err = nvs_get_str(handle, key, ret, &ret_length);
    ERROR_CHECK(err, return NULL);

    return ret;
}

static void handle_connect_wifi_state(esp_manager_client_handle_t client)
{
    esp_err_t err = wifi_sta_start(client);

    if (err != ESP_OK) {

        client->is_running = false;
    }

    xEventGroupWaitBits(client->event_group_handle, WIFI_CONNECTED_BIT, pdTRUE, pdTRUE, portMAX_DELAY);

    client->state = STATE_CONNECT_MQTT;
}

static void handle_connect_mqtt_state(esp_manager_client_handle_t client)
{
    esp_err_t err = mqtt_start(client);

    if (err != ESP_OK) {

        client->is_running = false;
    }

    EventBits_t bits = xEventGroupWaitBits(client->event_group_handle, MQTT_CONNECTED_BIT | MQTT_FAIL_BIT, pdFALSE, pdFALSE, portMAX_DELAY);

    if (bits & MQTT_FAIL_BIT) {

        client->is_running = false;
    }

    else {

        client->state = STATE_RUN;
    }
}

static void esp_manager_task(void *pvParameters)
{
    esp_manager_client_handle_t client = (esp_manager_client_handle_t)pvParameters;

    client->is_running = true;

    client->state = STATE_CONNECT_WIFI;

    while (client->is_running) {

        switch (client->state) {

        case STATE_CONNECT_WIFI:

            handle_connect_wifi_state(client);

            break;

        case STATE_CONNECT_MQTT:

            handle_connect_mqtt_state(client);

            break;

        case STATE_RUN:

            ESP_LOGI("esp_manager", "Running ...");
            vTaskDelay(2000 / portTICK_PERIOD_MS);

            break;

        default:

            break;
        }
    }
    
    vTaskDelete(NULL);
}

esp_manager_client_handle_t esp_manager_init(void)
{
    esp_err_t err;
    nvs_handle_t nvs_handle;

    err = nvs_flash_init();
    ERROR_CHECK(err, return NULL);

    err = nvs_open("esp_manager", NVS_READONLY, &nvs_handle);
    ERROR_CHECK(err, return NULL);

    esp_manager_client_handle_t client = heap_caps_calloc(1, sizeof(struct esp_manager_client), MALLOC_CAP_DEFAULT);
    NULL_CHECK(client, goto _init_failed);

    client->event_group_handle = xEventGroupCreate();
    NULL_CHECK(client->event_group_handle, goto _init_failed);

    // Read board's default configuration

    client->wifi_ssid = nvs_get_str_ptr(nvs_handle, "wifi_ssid");
    NULL_CHECK(client->wifi_ssid, goto _init_failed);

    client->wifi_password = nvs_get_str_ptr(nvs_handle, "wifi_password");
    NULL_CHECK(client->wifi_password, goto _init_failed);

    client->mqtt_username = nvs_get_str_ptr(nvs_handle, "mqtt_username");
    NULL_CHECK(client->mqtt_username, goto _init_failed);

    client->mqtt_password = nvs_get_str_ptr(nvs_handle, "mqtt_password");
    NULL_CHECK(client->mqtt_password, goto _init_failed);

    client->mqtt_broker_uri = nvs_get_str_ptr(nvs_handle, "mqtt_broker_uri");
    NULL_CHECK(client->mqtt_broker_uri, goto _init_failed);

    nvs_close(nvs_handle);

    return client;

_init_failed:

    nvs_close(nvs_handle);

    NULL_CHECK(client, return NULL);

    esp_manager_destroy(client);

    return NULL;
}

esp_err_t esp_manager_start(esp_manager_client_handle_t client)
{
    if (!client) {

        return ESP_ERR_INVALID_ARG;
    }

    if (xTaskCreate(esp_manager_task, "esp_manager_task", 4096, client, 5, &client->task_handle) != pdTRUE) {
        
        return ESP_FAIL;
    }

    return ESP_OK;
}

esp_err_t esp_manager_destroy(esp_manager_client_handle_t client)
{
    NULL_CHECK(client, return ESP_FAIL);

    NULL_CHECK(client->wifi_ssid, free(client->wifi_ssid));
    NULL_CHECK(client->wifi_password, free(client->wifi_password));
    NULL_CHECK(client->mqtt_username, free(client->mqtt_username));
    NULL_CHECK(client->mqtt_password, free(client->mqtt_password));
    NULL_CHECK(client->mqtt_broker_uri, free(client->mqtt_broker_uri));
    NULL_CHECK(client->task_handle, free(client->task_handle));
    NULL_CHECK(client->mqtt_handle, free(client->task_handle));
    NULL_CHECK(client->event_group_handle, free(client->event_group_handle));

    free(client);

    return ESP_OK;
}
