
import { connectAsync } from "mqtt";

export default async function getMqtt(config) {

    const client = await connectAsync(config.borkerUrl, {

        clientId: "esp-manager",
        username: config.username,
        password: config.password,
    });

    // Connect to the Dynamic Security Plugin as admin

    await client.subscribeAsync("$CONTROL/dynamic-security/v1/#");

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

    await client.publishAsync("$CONTROL/dynamic-security/v1", JSON.stringify(message));

    return client;
}