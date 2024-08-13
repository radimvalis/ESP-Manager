
<script setup>

    import { ref } from "vue";
    import { useRouter } from "vue-router";
    import { useSessionStore } from "@/stores/session";
    import Stepper from "@/components/Stepper.vue"
    import UploadStage from "@/components/NewFirmwareUploadStage.vue";
    import Alert from "@/components/Alert.vue";

    const STAGE = {

        UPLOAD: 1,
        FINISH: 2
    };

    const stages = [

        { title: "Upload", value: STAGE.UPLOAD },
        { title: "Finish", value: STAGE.FINISH }
    ];

    const router = useRouter();
    const session = useSessionStore();

    const currentStage = ref(STAGE.UPLOAD);

    const isError = ref(false);

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

                currentStage.value = STAGE.FINISH;
            }
        }

        catch(error) {

            isError.value = true;
        }
    }

    function inspect() {

        router.push({ name: "FirmwareDetail", params: { id: firmware.id } });
    }

    function retry() {

        name.value = null;
        firmwareFile.value = null;
        configFormFile.value = null;
        
        isError.value = false;
        currentStage.value = STAGE.UPLOAD;
    }

</script>

<template>

    <Stepper
        :model-value="currentStage"
        :steps="stages"
    />

    <UploadStage
        v-if="currentStage === STAGE.UPLOAD && !isError"
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

    <Alert
        v-if="currentStage === STAGE.FINISH && !isError"
        :title="'The firmware \'' + firmware.name + '\' has been successfully uploaded'"
        icon="mdi-check-circle"
        color="success"
    >

        <v-spacer/>

        <v-btn
            @click="inspect"
        >

            Inspect

        </v-btn>

    </Alert>

    <Alert
        v-if="isError"
        title="Upload failed ..."
        text="Please try it again."
        icon="mdi-close-circle"
        color="error"
    >

        <v-spacer/>

        <v-btn
            @click="retry"
        >

            Retry

        </v-btn>

    </Alert>

</template>