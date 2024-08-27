#include "esp_manager_priv.h"
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

    // Read board's default configuration

    client->id = nvs_get_str_ptr(nvs_handle, "id");
    NULL_CHECK(client->id, goto _init_failed);

    client->ssid = nvs_get_str_ptr(nvs_handle, "ssid");
    NULL_CHECK(client->ssid, goto _init_failed);

    client->password = nvs_get_str_ptr(nvs_handle, "password");
    NULL_CHECK(client->password, goto _init_failed);

    nvs_close(nvs_handle);

    return client;

_init_failed:

    nvs_close(nvs_handle);

    NULL_CHECK(client, return NULL);

    esp_manager_destroy(client);

    return NULL;
}

esp_err_t esp_manager_destroy(esp_manager_client_handle_t client)
{
    NULL_CHECK(client, return ESP_FAIL);

    NULL_CHECK(client->id, free(client->id));
    NULL_CHECK(client->ssid, free(client->ssid));
    NULL_CHECK(client->password, free(client->password));

    free(client);

    return ESP_OK;
}
