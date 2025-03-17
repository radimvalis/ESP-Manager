#include "esp_manager_priv.h"
#include "wifi.h"
#include "mqtt.h"
#include "config_update.h"
#include "firmware_update.h"
#include <cJSON.h>
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

static esp_err_t get_firmware_data(char **firmware_id, int16_t *version)
{
    esp_err_t err;
    nvs_handle_t nvs_handle;

    err = nvs_open("esp_manager", NVS_READONLY, &nvs_handle);
    ERROR_CHECK(err, return err);

    *firmware_id = nvs_get_str_ptr(nvs_handle, "firmware_id");
    NULL_CHECK(firmware_id, err = ESP_FAIL; goto _cleanup);

    err = nvs_get_i16(nvs_handle, "version", version);

_cleanup:

    nvs_close(nvs_handle);

    return err; 
}

static esp_err_t set_firmware_data(char *firmware_id, int version)
{
    esp_err_t err;
    nvs_handle_t nvs_handle;

    err = nvs_open("esp_manager", NVS_READWRITE, &nvs_handle);
    ERROR_CHECK(err, return ESP_FAIL);

    err = nvs_set_str(nvs_handle, "firmware_id", firmware_id);
    ERROR_CHECK(err, goto _cleanup);

    err = nvs_set_i16(nvs_handle, "version", version);
    ERROR_CHECK(err, goto _cleanup);

    nvs_commit(nvs_handle);

_cleanup:

    nvs_close(nvs_handle);

    return err;
}

static int publish_update_result(esp_manager_client_handle_t client, const char *topic)
{
    int msg_id;

    char *firmware_id;
    int16_t version;

    esp_err_t err = get_firmware_data(&firmware_id, &version);
    ERROR_CHECK(err, return -1);

    cJSON *root = cJSON_CreateObject();

    cJSON_AddStringToObject(root, "firmware_id", firmware_id);
    cJSON_AddNumberToObject(root, "version", version);

    char *message = cJSON_Print(root);

    msg_id = mqtt_publish(client, topic, message, 2);

    cJSON_Delete(root);
    cJSON_free(message);
    free(firmware_id);

    return msg_id;
}

static void handle_connect_wifi_state(esp_manager_client_handle_t client)
{
    esp_err_t err = wifi_sta_start(client);

    if (err != ESP_OK) {

        client->is_running = false;
    }

    esp_manager_event_t event;

    xQueueReceive(client->queue_handle, &event, portMAX_DELAY);

    if (event.id == EVENT_WIFI_CONNECTED) {

        client->state = STATE_CONNECT_MQTT;
    }

    else {

        client->is_running = false;
    }
}

static void handle_connect_mqtt_state(esp_manager_client_handle_t client)
{
    esp_err_t err = mqtt_start(client);

    if (err != ESP_OK) {

        client->is_running = false;
    }

    esp_manager_event_t event;

    xQueueReceive(client->queue_handle, &event, portMAX_DELAY);

    if (event.id == EVENT_MQTT_CONNECTED) {
        
        mqtt_publish(client, TOPIC_INFO_ONLINE, NULL, 1);

        client->state = STATE_RUN;
    }

    else {

        client->is_running = false;
    }
}

static void handle_run_state(esp_manager_client_handle_t client)
{
    esp_manager_event_t event;

    xQueueReceive(client->queue_handle, &event, portMAX_DELAY);

    if (event.id == EVENT_UPDATE) {

        cJSON *update_data = cJSON_Parse((char *)event.data);

        cJSON *firmware_id = cJSON_GetObjectItemCaseSensitive(update_data, "firmware_id");
        cJSON *version = cJSON_GetObjectItemCaseSensitive(update_data, "version");
        cJSON *firmware_url = cJSON_GetObjectItemCaseSensitive(update_data, "firmware_url");
        cJSON *config_url = cJSON_GetObjectItemCaseSensitive(update_data, "config_url");

        esp_err_t err = ESP_FAIL;

        if (firmware_url && firmware_url->valuestring) {

            err = firmware_update(client, firmware_url->valuestring);

            if (err == ESP_OK && config_url && config_url->valuestring) {

                err = config_update(client, config_url->valuestring);
            }
        }

        if (err == ESP_OK) {

            set_firmware_data(firmware_id->valuestring, version->valueint);

            publish_update_result(client, TOPIC_INFO_UPDATE_OK);

            vTaskDelay(1000 / portTICK_PERIOD_MS);

            esp_restart();
        }
        
        else {

            publish_update_result(client, TOPIC_INFO_UPDATE_ERROR);
        }

        cJSON_Delete(update_data);
    }

    else if (event.id == EVENT_BOOT_DEFAULT) {

        esp_err_t err = set_factory_as_boot_partition();
        
        if (err == ESP_OK) {

            set_firmware_data(DEFAULT_FIRMWARE_ID, DEFAULT_FIRMWARE_VERSION);

            publish_update_result(client, TOPIC_INFO_UPDATE_OK);

            vTaskDelay(1000 / portTICK_PERIOD_MS);

            esp_restart();
        }

        else {

            publish_update_result(client, TOPIC_INFO_UPDATE_ERROR);
        }
    }

    NULL_CHECK(!event.data, free(event.data));
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

            handle_run_state(client);

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

    client->queue_handle = xQueueCreate(5, sizeof(esp_manager_event_t));
    NULL_CHECK(client->queue_handle, goto _init_failed);

    // Read board's default configuration

    client->wifi_ssid = nvs_get_str_ptr(nvs_handle, "wifi_ssid");
    NULL_CHECK(client->wifi_ssid, goto _init_failed);

    client->wifi_password = nvs_get_str_ptr(nvs_handle, "wifi_password");
    NULL_CHECK(client->wifi_password, goto _init_failed);

    client->id = nvs_get_str_ptr(nvs_handle, "id");
    NULL_CHECK(client->id, goto _init_failed);

    client->http_password = nvs_get_str_ptr(nvs_handle, "http_password");
    NULL_CHECK(client->http_password, goto _init_failed);

    client->mqtt_password = nvs_get_str_ptr(nvs_handle, "mqtt_password");
    NULL_CHECK(client->mqtt_password, goto _init_failed);

    client->mqtt_broker_uri = nvs_get_str_ptr(nvs_handle, "mqtt_broker_uri");
    NULL_CHECK(client->mqtt_broker_uri, goto _init_failed);

    client->ca_bundle = nvs_get_str_ptr(nvs_handle, "ca_bundle");
    NULL_CHECK(client->ca_bundle, goto _init_failed);

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

    if (xTaskCreate(esp_manager_task, "esp_manager_task", 8192, client, 5, &client->task_handle) != pdTRUE) {
        
        return ESP_FAIL;
    }

    return ESP_OK;
}

esp_err_t esp_manager_destroy(esp_manager_client_handle_t client)
{
    NULL_CHECK(client, return ESP_FAIL);

    NULL_CHECK(!client->wifi_ssid, free(client->wifi_ssid));
    NULL_CHECK(!client->wifi_password, free(client->wifi_password));
    NULL_CHECK(!client->id, free(client->id));
    NULL_CHECK(!client->http_password, free(client->http_password));
    NULL_CHECK(!client->mqtt_password, free(client->mqtt_password));
    NULL_CHECK(!client->mqtt_broker_uri, free(client->mqtt_broker_uri));
    NULL_CHECK(!client->ca_bundle, free(client->ca_bundle));
    NULL_CHECK(!client->task_handle, vTaskDelete(client->task_handle));
    NULL_CHECK(!client->mqtt_handle, esp_mqtt_client_destroy(client->mqtt_handle));
    NULL_CHECK(!client->queue_handle, vQueueDelete(client->queue_handle));

    free(client);

    return ESP_OK;
}
