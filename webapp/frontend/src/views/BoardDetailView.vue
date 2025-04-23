
<script setup>

    import { ref, onMounted } from "vue";
    import { useDisplay } from "vuetify";
    import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
    import { useSessionStore } from "@/stores/session";
    import CopyButton from "@/components/CopyButton.vue";

    const route = useRoute();
    const router = useRouter();
    const session = useSessionStore();

    const { xs } = useDisplay();

    const alert = ref(false);
    const alertType = ref(null);
    const alertTitle = ref(null);

    const loadError = ref(false);

    const board = ref(null);

    onBeforeRouteLeave(() => {

        if (!loadError.value) {
        
            session.api.board.closeWatchStream();
        }
    });

    onMounted(async () => {

        if (route.query.new) {

            alertType.value = "success";
            alertTitle.value = "Board has been registered";
            alert.value = true;
        }

        try {

            board.value = await session.api.board.getOne(route.params.id);

            const onMessage = (updatedBoard) => {

                if (!updatedBoard.isBeingUpdated && board.value.isBeingUpdated) {

                    if (!updatedBoard.firmwareId && !board.value.firmwareId) {

                        // Flash fail

                        alertType.value = "error";
                        alertTitle.value = "Firmware flashing failed";
                    }

                    else if (updatedBoard.firmwareId && !board.value.firmwareId) {

                        // Flash ok

                        alertType.value = "success";
                        alertTitle.value = updatedBoard.firmware.name + " flashed successfully";
                    }
                    
                    else if (!updatedBoard.firmwareId && board.value.firmwareId) {

                        // Boot default ok

                        alertType.value = "success";
                        alertTitle.value = "Default app booted successfully"
                    }

                    else if (updatedBoard.firmwareId && board.value.firmwareId) {

                        if (updatedBoard.firmwareId !== board.value.firmwareId) {

                            // Flash ok

                            alertType.value = "success";
                            alertTitle.value = updatedBoard.firmware.name + " flashed successfully";
                        }

                        else {

                            if (updatedBoard.firmwareVersion > board.value.firmwareVersion) {

                                // Update ok

                                alertType.value = "success";
                                alertTitle.value = "Update to version " + updatedBoard.firmwareVersion + " succeeded";
                            }

                            else {

                                // Update / boot default fail

                                alertType.value = "error";
                                alertTitle.value = "Update failed";
                            }
                        }
                    }

                    alert.value = true;
                }

                board.value = updatedBoard
            };

            session.api.board.openWatchOneStream(board.value.id, onMessage);
        }

        catch {

            loadError.value = true;
        }
    });

    async function bootDefaultFirmware() {

        try {

            board.value = await session.api.board.bootDefaultFirmware(board.value.id);
        }

        catch(error) {

            alertType.value = "error";
            alertTitle.value = "Default app can't be booted now";
            alert.value = true;
        }
    }

    async function updateFirmware() {

        try {

            board.value = await session.api.board.updateFirmware(board.value.id);
        }

        catch(error) {

            alertType.value = "error";
            alertTitle.value = "Board can't be updated now";
            alert.value = true;
        }
    }

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

    <v-empty-state
        v-if="loadError"
        title="Board not found"
        text="The board you were looking for does not exist, or you do not have permission to access it."
    />

    <template
        v-if="board"
    >

        <template
            v-if="!board.isBeingUpdated"
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

                    <CopyButton
                        :text-to-copy="board.id"
                        size="small"
                    />

                    {{ board.id }}

                </v-card-subtitle>

                <v-divider/>

                <v-card-text>

                    <v-container>

                        <v-row>

                            <v-col
                                :cols="6"
                            >

                                <b>Chip</b>

                            </v-col>

                            <v-col>

                                {{ board.chipName.toUpperCase() }}

                            </v-col>

                        </v-row>

                        <v-row>

                            <v-col
                                :cols="6"
                            >

                                <b>Flash</b>

                            </v-col>

                            <v-col>

                                {{ board.flashSizeMB }} MiB

                            </v-col>

                        </v-row>

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

                                    {{ board.firmwareVersion + " (" + board.firmware.version  + ")" }}

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
                            @click="updateFirmware"
                            :class='{ "mb-2": xs }'
                            :disabled='board.firmwareStatus !== "update available" || !board.isOnline'
                            :block="xs"
                            color="success"
                            variant="flat"
                            slim
                        >

                            Update

                        </v-btn>

                        <v-btn
                            @click="bootDefaultFirmware"
                            :class='{ "mb-2": xs, "ml-2": !xs }'
                            :disabled="!board.isOnline || !board.firmwareId"
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
                            :disabled="!board.isOnline || board.isBeingUpdated"
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

        <template
            v-else
        >

            <v-container
                class="fill-height"
            >

                <v-row>

                    <v-col>

                        <v-card-info>

                            <v-card-text>

                                <v-progress-circular
                                    indeterminate
                                    :size="100"
                                    :width="10"
                                    color="primary"
                                />

                            </v-card-text>

                            <v-card-title>

                                Updating board

                            </v-card-title>

                        </v-card-info>
                    
                    </v-col>

                </v-row>

            </v-container>

        </template>

    </template>

</template>