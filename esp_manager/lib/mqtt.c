#include "mqtt.h"
#include <string.h>
#include "mqtt_client.h"

static char *create_topic_str(esp_manager_client_handle_t client, const char *topic_src, char *topic_dest)
{
    strcpy(topic_dest, client->id);

    if (*topic_src != '/') {

        strcat(topic_dest, "/");
    }

    strcat(topic_dest, topic_src);

    return topic_dest;
}

static char *get_data_str(esp_manager_client_handle_t client, esp_mqtt_event_handle_t mqtt_event)
{
    char *ret = malloc(mqtt_event->data_len + 1);
    NULL_CHECK(ret, return NULL);

    sprintf(ret, "%.*s", mqtt_event->data_len, mqtt_event->data);

    return ret;
}

static void mqtt_event_handler(void *args, esp_event_base_t event_base, int32_t event_id, void *event_data)
{
    esp_manager_client_handle_t client = args;

    switch ((esp_mqtt_event_id_t)event_id) {

    case MQTT_EVENT_CONNECTED:

        int msg_id;
        char topic[50];
        esp_manager_event_t connect_result_event;

        const char* subscribe_topics[] = { TOPIC_CMD_UPDATE, TOPIC_CMD_BOOT_DEFAULT };

        for (size_t i = 0; i < sizeof(subscribe_topics) / sizeof(subscribe_topics[0]); i++) {

            create_topic_str(client, subscribe_topics[i], topic);
            msg_id = esp_mqtt_client_subscribe(client->mqtt_handle, topic, 1);

            if (msg_id == -1) {

                break;
            }
        }

        if (msg_id != -1) {

            connect_result_event.id = EVENT_MQTT_CONNECTED;
        }

        else {

            connect_result_event.id = EVENT_MQTT_ERROR;
        }

        xQueueSend(client->queue_handle, &connect_result_event, 0);

        break;
    
    case MQTT_EVENT_DATA:

        esp_mqtt_event_handle_t mqtt_event = event_data;

        esp_manager_event_t data_event;

        if (strstr(mqtt_event->topic, TOPIC_CMD_UPDATE)) {

            data_event.id = EVENT_UPDATE;
            data_event.data = get_data_str(client, mqtt_event);

            xQueueSend(client->queue_handle, &data_event, 0);
        }

        else if (strstr(mqtt_event->topic, TOPIC_CMD_BOOT_DEFAULT)) {

            data_event.id = EVENT_BOOT_DEFAULT;
            data_event.data = get_data_str(client, mqtt_event);

            xQueueSend(client->queue_handle, &data_event, 0);   
        }

        break;

    default:

        break;
    }
}

int mqtt_publish(esp_manager_client_handle_t client, const char *topic, const char *data, int qos)
{
    char topic_with_id[60];
    create_topic_str(client, topic, topic_with_id);

    return esp_mqtt_client_publish(client->mqtt_handle, topic_with_id, data, 0, qos, 1);
}

esp_err_t mqtt_start(esp_manager_client_handle_t client)
{
    esp_err_t err;

    char last_will_topic[60];
    create_topic_str(client, TOPIC_INFO_OFFLINE, last_will_topic);

    esp_mqtt_client_config_t mqtt_config = {

        .broker.address.uri = client->mqtt_broker_uri,
        .broker.verification.certificate = client->ca_bundle,
        .broker.verification.skip_cert_common_name_check = true,

        .credentials.username = client->id,
        .credentials.authentication.password = client->mqtt_password,

        .session.keepalive = 10,
        .session.last_will.topic = last_will_topic,
        .session.last_will.qos = 1
    };

    client->mqtt_handle = esp_mqtt_client_init(&mqtt_config);
    NULL_CHECK(client->mqtt_handle, return ESP_FAIL);

    err = esp_mqtt_client_register_event(client->mqtt_handle, ESP_EVENT_ANY_ID, mqtt_event_handler, client);
    ERROR_CHECK(err, return err);

    err = esp_mqtt_client_start(client->mqtt_handle);
    ERROR_CHECK(err, return err);

    return ESP_OK;
}