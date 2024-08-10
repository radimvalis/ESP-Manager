
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
    import FinishStage from "@/components/NewBoardFinishStage.vue";
    import ErrorInfo from "@/components/NewBoardErrorInfo.vue";
    import NotSupportedInfo from "@/components/NewBoardNotSupportedInfo.vue";

    const STAGE = {

        CONNECT: 1,
        CONFIGURE: 2,
        FINISH: 3
    };

    const stages = [

        { title: "Connect", value: STAGE.CONNECT },
        { title: "Configure", value: STAGE.CONFIGURE },
        { title: "Finish", value: STAGE.FINISH },
    ];

    const router = useRouter();
    const session = useSessionStore();

    const navigatorRef = ref(navigator);

    const currentStage = ref(STAGE.CONNECT);
    
    const isConnecting = ref(false);
    const isFlashing = ref(false);
    const isError = ref(false);

    const form = ref(null);
    const configFormEntries = ref(null);
    const configData = ref(null);

    const flashProgress = ref(0);

    const flasher = new Flasher();

    let board = null;

    onMounted(async () => {

        if (navigator.serial) {

            navigator.serial.addEventListener("disconnect", () => {
        
                if (currentStage.value !== STAGE.FINISH) {

                    isError.value = true;
                }
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

            isConnecting.value = true;

            await flasher.connect();

            currentStage.value = STAGE.CONFIGURE;
        }

        catch(error) {

            isError.value = true;
        }

        finally {

            isConnecting.value = false;
        }
    }

    async function register() {

        try {

            const { valid } = await form.value.form.validate();

            if (valid) {

                board = await session.api.board.register(configData.value);

                isFlashing.value = true;

                const [ firmware, bootloader, partitionTable, config ] = await Promise.all([

                    session.api.file.getDefaultFirmware(),
                    session.api.file.getDefaultBootloader(),
                    session.api.file.getDefaultPartitionTable(),
                    session.api.file.getDefaultNVS(board.id)
                ]);

                const defaultApp = { firmware, bootloader, partitionTable, config };

                await flasher.program(defaultApp, (writtenPercentage) => flashProgress.value = writtenPercentage);

                currentStage.value = STAGE.FINISH;
            }
        }

        catch(error) {

            isError.value = true;
        }

        finally {

            await flasher.close();

            isFlashing.value = false;
            flashProgress.value = 0;
        }
    }

    function inspect() {

        router.push({ name: "BoardDetail", params: { id: board.id } });
    }

    function retry() {

        isError.value = false;
        currentStage.value = STAGE.CONNECT;
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

        <ConnectStage
            v-if="currentStage === STAGE.CONNECT && !isConnecting && !isError"
            @click-connect="connect"
        />

        <ConnectProgress
            v-if="currentStage === STAGE.CONNECT && isConnecting && !isError"
        />

        <ConfigureStage
            v-if="currentStage === STAGE.CONFIGURE && !isFlashing && !isError"
            @click-register="register"
        >

            <ConfigForm
                ref="form"
                v-model="configData"
                :entries="configFormEntries"
            />

        </ConfigureStage>

        <RegisterProgress
            v-if="currentStage === STAGE.CONFIGURE && isFlashing && !isError"
            :model-value="flashProgress"
        />

        <FinishStage
            v-if="currentStage === STAGE.FINISH && !isError"
            :board-name="board.name"
            @click-inspect="inspect"
        />

        <ErrorInfo
            v-if="isError"
            @click-retry="retry"
        />

    </template>

    <template
        v-else
    >

        <NotSupportedInfo/>

    </template>

</template>