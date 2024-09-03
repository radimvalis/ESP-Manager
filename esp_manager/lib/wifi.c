#include "wifi.h"
#include <string.h>
#include "esp_wifi.h"

static void wifi_event_handler(void *args, esp_event_base_t event_base, int32_t event_id, void *event_data)
{
    esp_manager_client_handle_t client = args;

    switch (event_id) {

    case WIFI_EVENT_STA_START:

        esp_wifi_connect();

        break;

    case IP_EVENT_STA_GOT_IP:
        
        esp_manager_event_t event = { .id = EVENT_WIFI_CONNECTED };

        xQueueSend(client->queue_handle, &event, 0);
        
        break;

    case WIFI_EVENT_STA_DISCONNECTED:

        esp_wifi_connect();

        break;
    
    default:

        break;
    }
}

esp_err_t wifi_sta_start(esp_manager_client_handle_t client)
{
    esp_err_t err;

    err = esp_netif_init();
    ERROR_CHECK(err, return err);
    
    err = esp_event_loop_create_default();
    ERROR_CHECK(err, return err);

    esp_netif_t *sta_netif = esp_netif_create_default_wifi_sta();

    wifi_init_config_t config = WIFI_INIT_CONFIG_DEFAULT();

    err = esp_wifi_init(&config);
    ERROR_CHECK(err, goto _connect_failed);

    err = esp_event_handler_register(WIFI_EVENT, ESP_EVENT_ANY_ID, &wifi_event_handler, client);
    ERROR_CHECK(err, goto _connect_failed);

    err = esp_event_handler_register(IP_EVENT, IP_EVENT_STA_GOT_IP, &wifi_event_handler, client);
    ERROR_CHECK(err, goto _connect_failed);

    wifi_config_t wifi_config = {};

    strcpy((char*)wifi_config.sta.ssid, client->wifi_ssid);
    strcpy((char*)wifi_config.sta.password, client->wifi_password);

    err = esp_wifi_set_mode(WIFI_MODE_STA);
    ERROR_CHECK(err, goto _connect_failed);

    err = esp_wifi_set_config(WIFI_IF_STA, &wifi_config);
    ERROR_CHECK(err, goto _connect_failed);

    err = esp_wifi_start();
    ERROR_CHECK(err, goto _connect_failed);

    return ESP_OK;

_connect_failed:

    esp_netif_destroy(sta_netif);

    return err;
}