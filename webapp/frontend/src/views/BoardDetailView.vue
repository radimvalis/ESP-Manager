
<script setup>

    import { ref, onMounted } from "vue";
    import { useDisplay } from "vuetify";
    import { useRoute, useRouter } from "vue-router";
    import { useSessionStore } from "@/stores/session";

    const route = useRoute();
    const router = useRouter();
    const session = useSessionStore();

    const { xs, smAndUp } = useDisplay();

    const board = ref(null);

    onMounted(async () => {

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

        }
    }

</script>

<template>

    <template
        v-if="board"
    >

        <v-card
            class="mx-auto"
            :class='{ "mt-5": smAndUp }'
            :rounded="smAndUp"
            max-width="600"
        >

            <template #title>

                <div
                    class="mt-6"
                >

                {{ board.name }}


                </div>

            </template>

            <template #append>

                <v-chip
                    class="mt-6"
                    :text='board.isOnline ? "online" : "offline"'
                    :color='board.isOnline ? "success" : "error"'
                    :prepend-icon='board.isOnline ? "mdi-check-circle-outline" : "mdi-alert-circle-outline"'
                />

            </template>

            <v-card-subtitle
                class="mb-6"
            >

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

        </v-card>

    </template>

</template>