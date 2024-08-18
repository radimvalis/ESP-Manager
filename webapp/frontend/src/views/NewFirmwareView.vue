
<script setup>

    import { ref } from "vue";
    import { useDisplay } from "vuetify";
    import { useRouter } from "vue-router";
    import { useSessionStore } from "@/stores/session";
    import UploadStage from "@/components/NewFirmwareUploadStage.vue";

    const router = useRouter();
    const session = useSessionStore();

    const { smAndUp } = useDisplay();

    const alert = ref(false);
    const alertTitle = ref(null);

    const form = ref(null);

    const name = ref(null);
    const firmwareFile = ref(null);
    const configFormFile = ref(null);

    let firmware = null;

    const nameRules = [
                    
        (x) => !!x || "Firmware name is required",
        (x) => /^[a-z0-9]+$/i.test(x) || "Only alphanumeric characters are allowed"
    ];

    const firmwareRules = [

        () => !!firmwareFile.value || "Firmware is required",
        () => firmwareFile.value.type === "application/octet-stream" || "This is not a .bin file"
    ]

    const configFormRules = [

        () => !!configFormFile.value || "Config form is required",
        () => configFormFile.value.type === "application/json" || "This is not a .json file" 
    ];

    async function upload() {
        
        try {

            const { valid } = await form.value.validate();

            if (valid) {

                firmware = await session.api.firmware.create(name.value, firmwareFile.value, configFormFile.value);

                router.push({ name: "FirmwareDetail", params: { id: firmware.id }, query: { new: true } });
            }
        }

        catch(error) {

            if (error.response) {

                alertTitle.value = error.response.status + " " + error.response.statusText + " Error";
            }

            else {

                alertTitle.value = "Upload failed";
            }

            name.value = null;
            firmwareFile.value = null;
            configFormFile.value = null;

            alert.value = true;
        }
    }

</script>

<template>

    <v-alert
        v-if="alert"
        @click:close="alert = false"
        class="mx-auto"
        :class='{ "mt-4": smAndUp }'
        :rounded="smAndUp"
        variant="elevated"
        max-width="600"
        type="error"
        :title="alertTitle"
        text="Please try the upload again."
        closable
    />

    <UploadStage
        @click-upload="upload"
    >

        <v-form
            ref="form"
        >

            <v-text-field
                v-model="name"
                class="my-2"
                label="Firmware name"
                variant="outlined"
                :rules="nameRules"
            />

            <v-file-input
                v-model="firmwareFile"
                class="my-2"
                label="Firmware file"
                variant="outlined"
                :rules="firmwareRules"
            />

            <v-file-input
                v-model="configFormFile"
                class="my-2"
                label="Config form file"
                variant="outlined"
                :rules="configFormRules"
            />

        </v-form>

    </UploadStage>

</template>