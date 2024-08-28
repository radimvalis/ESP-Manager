idf_component_register(
    SRCS "esp_manager.c" "lib/wifi.c"
    INCLUDE_DIRS "include"
    PRIV_INCLUDE_DIRS "lib/include"
    PRIV_REQUIRES "nvs_flash" "esp_wifi"
)