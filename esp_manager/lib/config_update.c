#include "config_update.h"
#include <string.h>
#include "nvs_flash.h"
#include "esp_http_client.h"

#define BUFFER_SIZE 1024

static esp_err_t write_config(esp_manager_client_handle_t client, const esp_partition_t *partition, const char *image_url)
{
    esp_err_t err;

    esp_http_client_config_t http_config = {

        .url = image_url,
        .transport_type = HTTP_TRANSPORT_OVER_SSL,
        .cert_pem = client->server_crt,
        .keep_alive_enable = true
    };

    esp_http_client_handle_t http_client = esp_http_client_init(&http_config);
    NULL_CHECK(http_client, return ESP_FAIL);

    err = esp_http_client_open(http_client, 0);
    ERROR_CHECK(err, goto _cleanup);

    esp_http_client_fetch_headers(http_client);

    char buffer[BUFFER_SIZE + 1] = { 0 };

    int image_length = 0;

    while (true) {

        int data_length = esp_http_client_read(http_client, buffer, BUFFER_SIZE);

        if (data_length < 0) {

            err = ESP_FAIL;

            goto _cleanup;
        }

        else if (data_length > 0) {

            err = esp_partition_write(partition, image_length, (const void *)buffer, data_length);
            ERROR_CHECK(err, goto _cleanup);

            image_length += data_length;
        }

        else {

            break;
        }
    }

    if (!esp_http_client_is_complete_data_received(http_client)) {

        goto _cleanup;
    }

    err = ESP_OK;

_cleanup:

    esp_http_client_close(http_client);
    esp_http_client_cleanup(http_client);

    return err; 
}

esp_err_t config_update(esp_manager_client_handle_t client, const char *config_url)
{
    esp_err_t err;

    esp_partition_iterator_t pi = esp_partition_find(ESP_PARTITION_TYPE_DATA, ESP_PARTITION_SUBTYPE_DATA_NVS, "config");
    NULL_CHECK(pi, return ESP_FAIL);

    const esp_partition_t *config_partition = esp_partition_get(pi);
    
    esp_partition_iterator_release(pi);

    NULL_CHECK(config_partition, return ESP_FAIL);

    err = esp_partition_erase_range(config_partition, 0, config_partition->size);
    ERROR_CHECK(err, return err);

    err = write_config(client, config_partition, config_url);
    ERROR_CHECK(err, return err);

    return ESP_OK;
}