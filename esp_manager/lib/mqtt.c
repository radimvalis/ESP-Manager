#include "mqtt.h"
#include <string.h>
#include "mqtt_client.h"
#include "esp_log.h"

static char *create_topic_str(const esp_manager_client_handle_t client, const char *topic_src, char *topic_dest)
{
    strcpy(topic_dest, client->mqtt_username);

    if (*topic_src != '/') {

        strcat(topic_dest, "/");
    }

    strcat(topic_dest, topic_src);

    return topic_dest;
}

static void mqtt_event_handler(void *args, esp_event_base_t event_base, int32_t event_id, void *event_data)
{

    esp_manager_client_handle_t client = args;

    switch ((esp_mqtt_event_id_t)event_id) {

    case MQTT_EVENT_CONNECTED:

        char topic[50];
        create_topic_str(client, "#", topic);

        int msg_id = esp_mqtt_client_subscribe(client->mqtt_handle, topic, 1);

        if (msg_id == -1) {

            xEventGroupSetBits(client->event_group_handle, MQTT_FAIL_BIT);
        }

        else {

            xEventGroupSetBits(client->event_group_handle, MQTT_CONNECTED_BIT);
        }

        break;
    
    case MQTT_EVENT_DATA:

        esp_mqtt_event_handle_t mqtt_event = event_data;

        ESP_LOGI("mqtt", "TOPIC=%.*s", mqtt_event->topic_len, mqtt_event->topic);
        ESP_LOGI("mqtt", "DATA=%.*s", mqtt_event->data_len, mqtt_event->data);

        break;

    default:

        break;
    }
}

esp_err_t mqtt_start(esp_manager_client_handle_t client)
{
    esp_err_t err;

    char last_will_topic[50];
    create_topic_str(client, "offline", last_will_topic);

    esp_mqtt_client_config_t mqtt_config = {

        .broker.address.uri = client->mqtt_broker_uri,

        .credentials.username = client->mqtt_username,
        .credentials.authentication.password = client->mqtt_password,

        .session.keepalive = 10,
        .session.last_will.topic = last_will_topic,
        .session.last_will.qos = 1
    };

    client->mqtt_handle = esp_mqtt_client_init(&mqtt_config);
    NULL_CHECK(client->mqtt_handle, return ESP_FAIL);

    err = esp_mqtt_client_register_event(client->mqtt_handle, ESP_EVENT_ANY_ID, mqtt_event_handler, client);
    ERROR_CHECK(err, return ESP_FAIL);

    err = esp_mqtt_client_start(client->mqtt_handle);
    ERROR_CHECK(err, return ESP_FAIL);

    return ESP_OK;
}