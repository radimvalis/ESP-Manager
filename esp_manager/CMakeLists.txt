idf_component_register(
    SRCS "esp_manager.c" "lib/wifi.c" "lib/mqtt.c" "lib/config_update.c" "lib/firmware_update.c"
    INCLUDE_DIRS "include"
    PRIV_INCLUDE_DIRS "lib/include"
    PRIV_REQUIRES "nvs_flash" "esp_wifi" "mqtt" "esp_partition" "esp_http_client" "app_update" "esp_https_ota" "json"
)