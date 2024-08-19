
<script setup>

    import { ref, onMounted } from "vue";
    import { useDisplay } from "vuetify";
    import { useRoute, useRouter } from "vue-router";
    import { useSessionStore } from "@/stores/session";

    const route = useRoute();
    const router = useRouter();
    const session = useSessionStore();

    const { xs } = useDisplay();

    const isFormValid = ref(null);

    const updatedFirmwareFile = ref(null);

    const alert = ref(false);
    const alertType = ref(null);
    const alertTitle = ref(null);

    const firmware = ref(null);

    const rules = [

        () => updatedFirmwareFile.value ? updatedFirmwareFile.value.type === "application/octet-stream" ? true : "This is not a .bin file" : true
    ];

    onMounted(async () => {

        if (route.query.new) {

            alertType.value = "success";
            alertTitle.value = "Firmware has been uploaded";
            alert.value = true;
        }

        try {

            firmware.value = await session.api.firmware.get(route.params.id);
        }

        catch(error) {

        }
    });

    async function updateFirmware() {

        try {

            firmware.value = await session.api.firmware.update(firmware.value.id, updatedFirmwareFile.value);

            alertType.value = "success";
            alertTitle.value = "Update to version " + firmware.value.version + " succeeded";

        }

        catch(error) {

            alertType.value = "error";
            alertTitle.value = "Update to version " + firmware.value.version + " failed";
        }

        finally {

            alert.value = true;

            updatedFirmwareFile.value = null;
        }
    }

    async function deleteFirmware() {

        try {

            await session.api.firmware.delete(firmware.value.id);

            router.push({ name: "Firmwares" });
        }

        catch(error) {

            alertType.value = "error";
            alertTitle.value = "Firmware can't be deleted now";
            alert.value = true;
        }
    }

</script>

<template>

    <template
        v-if="firmware"
    >

        <v-alert
            v-if="alert"
            @click:close="alert = false"
            :type="alertType"
            :title="alertTitle"
        />

        <v-card-main>

            <template #title>

                {{ firmware.name }}

            </template>

            <template #append>

                <v-chip
                    class="mt-4"
                    :text='"version " + firmware.version'
                />

            </template>

        <v-card-subtitle>

            {{ firmware.id }}

        </v-card-subtitle>

        <v-divider/>

            <v-card-text>

                <v-form
                    v-model="isFormValid"
                    class="mb-4"
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

        </v-card-main>

    </template>

</template>