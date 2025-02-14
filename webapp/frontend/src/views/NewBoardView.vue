
<script setup>

    import { ref, onMounted } from "vue";
    import { useRouter } from "vue-router";
    import { useSessionStore } from "@/stores/session";
    import Flasher from "@/utils/Flasher";
    import ConfigForm from "@/components/ConfigForm.vue";
    import Stepper from "@/components/Stepper.vue"
    import ConnectStage from "@/components/NewBoardConnectStage.vue";
    import ConnectProgress from "@/components/NewBoardConnectProgress.vue";
    import ConfigureStage from "@/components/NewBoardConfigureStage.vue";
    import RegisterProgress from "@/components/NewBoardRegisterProgress.vue";
    import NotSupportedInfo from "@/components/NewBoardNotSupportedInfo.vue";
    
    const STAGE = {

        CONNECT: 1,
        CONFIGURE: 2
    };

    const REGISTER_PROGRESS_STAGE = {

        ERASE: 1,
        FLASH: 2
    };

    const stages = [

        { title: "Connect", value: STAGE.CONNECT },
        { title: "Configure", value: STAGE.CONFIGURE }
    ];

    const router = useRouter();
    const session = useSessionStore();

    const navigatorRef = ref(navigator);

    const currentStage = ref(STAGE.CONNECT);
    
    const isConnecting = ref(false);
    const isRegistering = ref(false);
    const registerProgressStage = ref(REGISTER_PROGRESS_STAGE.ERASE);

    const alert = ref(false);
    const alertTitle = ref(null);
    const alertText = ref(null);

    const form = ref(null);
    const configFormEntries = ref(null);
    const configData = ref(null);

    const flashProgress = ref(0);

    const flasher = new Flasher();

    let board = null;

    onMounted(async () => {

        if (navigator.serial) {

            navigator.serial.addEventListener("disconnect", () => {
        
                isConnecting.value = false;
                isRegistering.value = false;

                currentStage.value = STAGE.CONNECT;

                alertTitle.value = "Board has been disconnected";
                alertText.value = "Please unplug the board and plug it back in, then try the registration again.";
                alert.value = true;
            });

            configFormEntries.value = await session.api.file.getDefaultConfigForm();

            configData.value = {};

            configFormEntries.value.forEach((entry) => {

                configData.value[entry.key] = undefined;
            });
        }
    });

    async function connect() {

        try {

            await flasher.requestPort();

            alert.value = false;

            isConnecting.value = true;

            await flasher.connect();

            isConnecting.value = false;

            currentStage.value = STAGE.CONFIGURE;
        }

        catch(error) {

            isConnecting.value = false;

            alertTitle.value = "Board connection failed";
            alertText.value = "Please unplug the board and plug it back in, then try the registration again.";
            alert.value = true;
        }
    }

    async function register() {

        try {

            const { valid } = await form.value.form.validate();

            if (valid) {

                board = await session.api.board.register(configData.value);

                alert.value = false;

                isRegistering.value = true;
                registerProgressStage.value = REGISTER_PROGRESS_STAGE.ERASE;

                const [ _, firmware, bootloader, partitionTable, config ] = await Promise.all([

                    flasher.eraseFlash(),
                    session.api.file.getDefaultFirmware(),
                    session.api.file.getDefaultBootloader(),
                    session.api.file.getDefaultPartitionTable(),
                    session.api.file.getDefaultNVS(board.id)
                ]);

                const defaultApp = { firmware, bootloader, partitionTable, config };

                registerProgressStage.value = REGISTER_PROGRESS_STAGE.FLASH;

                await flasher.program(defaultApp, (writtenPercentage) => flashProgress.value = writtenPercentage);

                await flasher.close();

                router.push({ name: "BoardDetail", params: { id: board.id }, query: { new: true } });
            }
        }

        catch(error) {

            if (error.response) {

                await form.value.form.reset();

                alertTitle.value = error.response.status + " " + error.response.statusText + " Error";
            }

            else {

                await flasher.close();

                await session.api.board.delete(board.id);

                alertTitle.value = "Registration failed";

                currentStage.value = STAGE.CONNECT;
            }

            flashProgress.value = 0;
            isRegistering.value = false;
            registerProgressStage.value = REGISTER_PROGRESS_STAGE.FLASH;

            alertText.value = null;
            alert.value = true;
        }
    }

</script>

<template>

    <template
        v-if="navigatorRef.serial"
    >

        <Stepper
            :model-value="currentStage"
            :steps="stages"
        />

        <v-alert
            v-if="alert"
            @click:close="alert = false"
            type="error"
            :title="alertTitle"
            :text="alertText"
        />

        <ConnectStage
            v-if="currentStage === STAGE.CONNECT && !isConnecting"
            @click-connect="connect"
        />

        <ConnectProgress
            v-if="isConnecting"
        />

        <ConfigureStage
            v-if="currentStage === STAGE.CONFIGURE && !isRegistering"
            @click-register="register"
        >

            <ConfigForm
                ref="form"
                v-model="configData"
                :entries="configFormEntries"
            />

        </ConfigureStage>

        <RegisterProgress
            v-if="isRegistering"
            :model-value="flashProgress"
            :stage="registerProgressStage"
        />

    </template>

    <template
        v-else
    >

        <NotSupportedInfo/>

    </template>

</template>