#ifndef ESP_MANAGER_PRIV_H_
#define ESP_MANAGER_PRIV_H_

#include "esp_manager.h"

#define NULL_CHECK(x, action) if(!(x)) { action; }

#define ERROR_CHECK(x, action) if((x) != ESP_OK) { action; }

struct esp_manager_client {

    char* id;
    char* ssid;
    char* password;
};

#endif