#include "firmware_update.h"
#include "esp_http_client.h"
#include "esp_partition.h"
#include "esp_https_ota.h"
#include "esp_ota_ops.h"

esp_err_t set_factory_as_boot_partition()
{
    esp_partition_iterator_t pi = esp_partition_find(ESP_PARTITION_TYPE_APP, ESP_PARTITION_SUBTYPE_APP_FACTORY, NULL);
    NULL_CHECK(pi, return ESP_FAIL);

    const esp_partition_t *factory_partition = esp_partition_get(pi);

    esp_partition_iterator_release(pi);

    NULL_CHECK(factory_partition, return ESP_FAIL);

    return esp_ota_set_boot_partition(factory_partition);
}

esp_err_t firmware_update(esp_manager_client_handle_t client, const char *firmware_url)
{
    esp_http_client_config_t http_config = {

        .url = firmware_url,
        .username = client->id,
        .password = client->http_password,
        .auth_type = HTTP_AUTH_TYPE_BASIC,
        .transport_type = HTTP_TRANSPORT_OVER_SSL,
        .cert_pem = client->ca_bundle,
        .skip_cert_common_name_check = true
    };

    esp_https_ota_config_t ota_config = {

        .http_config = &http_config,
    };

    return esp_https_ota(&ota_config);   
}