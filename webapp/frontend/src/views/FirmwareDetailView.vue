
<script setup>

    import { ref, onMounted } from "vue";
    import { useDisplay } from "vuetify";
    import { useRoute, useRouter } from "vue-router";
    import { useSessionStore } from "@/stores/session";

    const route = useRoute();
    const router = useRouter();
    const session = useSessionStore();

    const { xs, smAndUp } = useDisplay();

    const isFormValid = ref(null);

    const updatedFirmwareFile = ref(null);

    const firmware = ref(null);

    const rules = [

        () => updatedFirmwareFile.value ? updatedFirmwareFile.value.type === "application/octet-stream" ? true : "This is not a .bin file" : true
    ];

    onMounted(async () => {

        try {

            firmware.value = await session.api.firmware.get(route.params.id);
        }

        catch(error) {

        }
    });

    async function updateFirmware() {

        try {

            firmware.value = await session.api.firmware.update(firmware.value.id, updatedFirmwareFile.value);

            updatedFirmwareFile.value = null;
        }

        catch(error) {

        }
    }

    async function deleteFirmware() {

        try {

            await session.api.firmware.delete(firmware.value.id);

            router.push({ name: "Firmwares" });
        }

        catch(error) {

        }
    }

</script>

<template>

    <template
        v-if="firmware"
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

                    {{ firmware.name }}


                </div>

            </template>

            <template #append>

                <v-chip
                    class="mt-6"
                    :text='"version " + firmware.version'
                />

            </template>

        <v-card-subtitle
            class="mb-6"
        >

            {{ firmware.id }}

        </v-card-subtitle>

        <v-divider/>

            <v-card-text>

                <v-form
                    v-model="isFormValid"
                    class="mb-5"
                >

                    <v-file-input
                        v-model="updatedFirmwareFile"
                        :rules="rules"
                        label="Updated firmware file"
                        variant="outlined"
                        density="compact"
                    />

                </v-form>

                <div
                    class="d-flex"
                    :class='{ "flex-column": xs }'
                >

                    <v-btn
                        @click="updateFirmware"
                        :class='{ "mb-2": xs }'
                        :disabled="!isFormValid || !updatedFirmwareFile"
                        :block="xs"
                        color="success"
                        variant="flat"
                        slim
                    >

                        Update

                    </v-btn>

                    <v-btn
                        @click="deleteFirmware"
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