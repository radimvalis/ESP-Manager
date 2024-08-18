
<script setup>

    import { ref, onMounted } from "vue";
    import { useDisplay } from "vuetify";
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

    const stages = [

        { title: "Connect", value: STAGE.CONNECT },
        { title: "Configure", value: STAGE.CONFIGURE }
    ];

    const router = useRouter();
    const session = useSessionStore();

    const { smAndUp } = useDisplay();

    const navigatorRef = ref(navigator);

    const currentStage = ref(STAGE.CONNECT);
    
    const isConnecting = ref(false);
    const isFlashing = ref(false);

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
                isFlashing.value = false;

                currentStage.value = STAGE.CONNECT;

                alertTitle.value = "Board has been disconnected";
                alertText.value = "Please unplug the board and plug it back in, then try the registration again.";
                alert.value = true;
            });

            configFormEntries.value = await session.api.file.getDefaultConfigForm();

            configData.value = {};

            configFormEntries.value.forEach((entry) => {

                configData.value[entry.key] = "";
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

                isFlashing.value = true;

                const [ firmware, bootloader, partitionTable, config ] = await Promise.all([

                    session.api.file.getDefaultFirmware(),
                    session.api.file.getDefaultBootloader(),
                    session.api.file.getDefaultPartitionTable(),
                    session.api.file.getDefaultNVS(board.id)
                ]);

                const defaultApp = { firmware, bootloader, partitionTable, config };

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

                alertTitle.value = "Registration failed";

                currentStage.value = STAGE.CONNECT;
            }

            isFlashing.value = false;
            flashProgress.value = 0;

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
            class="mx-auto"
            :class='{ "my-4": smAndUp }'
            :rounded="smAndUp"
            variant="elevated"
            max-width="600"
            type="error"
            :title="alertTitle"
            :text="alertText"
            closable
        />

        <ConnectStage
        v-if="currentStage === STAGE.CONNECT && !isConnecting"
            @click-connect="connect"
        />

        <ConnectProgress
        v-if="isConnecting"
        />

        <ConfigureStage
        v-if="currentStage === STAGE.CONFIGURE && !isFlashing"
            @click-register="register"
        >

            <ConfigForm
                ref="form"
                v-model="configData"
                :entries="configFormEntries"
            />

        </ConfigureStage>

        <RegisterProgress
        v-if="isFlashing"
            :model-value="flashProgress"
        />

    </template>

    <template
        v-else
    >

        <NotSupportedInfo/>

    </template>

</template>