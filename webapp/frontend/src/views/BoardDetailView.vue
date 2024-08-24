
<script setup>

    import { ref, onMounted } from "vue";
    import { useDisplay } from "vuetify";
    import { useRoute, useRouter } from "vue-router";
    import { useSessionStore } from "@/stores/session";

    const route = useRoute();
    const router = useRouter();
    const session = useSessionStore();

    const { xs } = useDisplay();

    const alert = ref(false);
    const alertType = ref(null);
    const alertTitle = ref(null);

    const board = ref(null);

    onMounted(async () => {

        if (route.query.new) {

            alertType.value = "success";
            alertTitle.value = "Board has been registered";
            alert.value = true;
        }

        try {

            board.value = await session.api.board.get(route.params.id);
        }

        catch(error) {

        }
    });

    async function deleteBoard() {

        try {

            await session.api.board.delete(board.value.id);

            router.push({ name: "Boards" });
        }

        catch(error) {

            alertType.value = "error";
            alertTitle.value = "Board can't be deleted now";
            alert.value = true;
        }
    }

</script>

<template>

    <template
        v-if="board"
    >

        <v-alert
            v-if="alert"
            @click:close="alert = false"
            :type="alertType"
            :title="alertTitle"
        />

        <v-card-main>

            <template #title>

                {{ board.name }}

            </template>

            <template #append>

                <v-chip
                    class="mt-4"
                    :text='board.isOnline ? "online" : "offline"'
                    :color='board.isOnline ? "success" : "error"'
                    :prepend-icon='board.isOnline ? "mdi-check-circle-outline" : "mdi-alert-circle-outline"'
                />

            </template>

            <v-card-subtitle>

                {{ board.id }}

            </v-card-subtitle>

            <v-divider/>

            <v-card-text>

                <v-container>

                    <v-row>

                        <v-col
                            :cols="6"
                        >

                            <b>Firmware</b>

                        </v-col>

                        <v-col>

                            {{ board.firmware?.name || "default" }}

                        </v-col>

                    </v-row>

                    <v-row>

                        <v-col>

                            <b>Version</b>

                        </v-col>

                        <v-col>

                            <div
                                v-if="board.firmwareVersion"
                            >

                                {{ board.firmwareVersion + " (latest " + board.firmware.version  + ")" }}

                            </div>

                            <div
                                v-else
                            >

                                -

                            </div>

                        </v-col>

                    </v-row>

                </v-container>

                <div
                    class="d-flex"
                    :class='{ "flex-column": xs }'
                >

                    <v-btn
                        :class='{ "mb-2": xs }'
                        :disabled='board.firmwareStatus === "latest" || !board.isOnline'
                        :block="xs"
                        color="success"
                        variant="flat"
                        slim
                    >

                        Update

                    </v-btn>

                    <v-btn
                        :class='{ "mb-2": xs, "ml-2": !xs }'
                        :disabled="!board.isOnline"
                        :block="xs"
                        color="primary"
                        variant="flat"
                        slim
                    >

                        Boot default

                    </v-btn>

                    <v-btn
                        :class='{ "mb-2": xs, "ml-2": !xs }'
                        :to='{ name: "FlashBoard", query: { "id": board.id } }'
                        :block="xs"
                        color="primary"
                        variant="flat"
                        slim
                    >

                        Flash

                    </v-btn>

                    <v-btn
                        @click="deleteBoard"
                        :class='{ "ml-auto": !xs }'
                        :block="xs"
                        color="error"
                        variant="flat"
                        slim
                    >

                        Delete

                    </v-btn>

                </div>

            </v-card-text>

        </v-card-main>

    </template>

</template>