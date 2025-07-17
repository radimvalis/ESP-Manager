
import { connectAsync } from "mqtt";

/**
 * Connects to MQTT broker
 * @param {object} config - MQTT configuration
 * @returns {object} - MQTT client
 */
export default async function getMqtt(config) {

    const client = await connectAsync(config.brokerUrl, {

        ca: config.caBundle,
        rejectUnauthorized: false,
        clientId: "esp-manager",
        username: config.username,
        password: config.password,
    });

    // Connect as Dynamic Security Plugin admin

    const message = {

        commands: [
            {
                command: "addRoleACL",
                rolename: "admin",
                acltype: "publishClientSend",
                topic: "#",
                allow: true
            }
        ]
    };

    await client.publishAsync("$CONTROL/dynamic-security/v1", JSON.stringify(message), { qos: 1 });

    return client;
}