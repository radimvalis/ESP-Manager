
<script setup>

    import { ref, onMounted } from "vue";
    import { useRoute, useRouter } from "vue-router";
    import { useSessionStore } from "@/stores/session";
    import ConfigForm from "@/components/ConfigForm.vue";
    import Stepper from "@/components/Stepper.vue";
    import Overview from "@/components/FlashBoardOverview.vue";
    import SelectBoard from "@/components/FlashBoardSelectBoardStage.vue";
    import SelectFirmware from "@/components/FlashBoardSelectFirmwareStage.vue";
    import ConfigureFirmware from "@/components/FlashBoardConfigureStage.vue"

    const STAGE = {

        SELECT_BOARD: 1,
        SELECT_FIRMWARE: 2,
        CONFIGURE: 3
    };

    const stages = [

        { title: "Select board", value: STAGE.SELECT_BOARD },
        { title: "Select firmware", value: STAGE.SELECT_FIRMWARE },
        { title: "Configure", value: STAGE.CONFIGURE }
    ];

    const props = defineProps({ board: Object })

    const route = useRoute();
    const router = useRouter();
    const session = useSessionStore();

    const currentStage = ref(null);

    const alert = ref(false);
    const alertTitle = ref(null);
    const alertText = ref(null);

    const loadError = ref(false);

    const boards = ref(null);

    const boardToFlash = ref(null);

    const firmwareId = ref(null);
    const firmware = ref(null);

    const form = ref(null);
    const configFormEntries = ref(null);
    const configData = ref(null);

    onMounted(async () => {

        try {

            boards.value = await session.api.board.getAll();

            // Filter out offline boards

            boards.value = boards.value.filter((b) => b.isOnline);

            currentStage.value = STAGE.SELECT_BOARD;

            if (route.query.id) {

                for (const board of boards.value) {

                    if (board.id === route.query.id) {

                        boardToFlash.value = board;

                        currentStage.value = STAGE.SELECT_FIRMWARE;

                        break;
                    }
                }
            }
        }

        catch(error) {

            loadError.value = true;
        }
    });

    function selectBoard() {

        currentStage.value = STAGE.SELECT_FIRMWARE;
    }

    async function selectFirmware() {

        try {

            alert.value = false;

            const data = await Promise.all([

                session.api.firmware.getOne(firmwareId.value),
                session.api.file.getConfigForm(firmwareId.value)
            ]);

            firmware.value = data[0];

            configFormEntries.value = data[1];

            configData.value = {};

            configFormEntries.value.forEach((entry) => {

                configData.value[entry.key] = undefined;
            });

            currentStage.value = STAGE.CONFIGURE;
        }

        catch(error) {

            firmwareId.value = null;

            alertTitle.value = "Firmware not found";
            alert.value = true;
        }
    }

    async function flash() {

        try {

            const { valid } = await form.value.form.validate();

            if (valid) {

                await session.api.board.flash(boardToFlash.value.id, firmware.value.id, configData.value);

                router.push({ name: "BoardDetail", params: { id: boardToFlash.value.id } });
            }
        }

        catch(error) {

            if (error.response) {

                alertTitle.value = error.response.status + ": " + error.response.statusText;
                alertText.value = error.response.data.message;
            }

            else {

                alertTitle.value = "Board can't be flashed now"
            }

            alert.value = true;
        }
    }

    function resetBoardSelection() {

        alert.value = false;
        firmwareId.value = null;
        boardToFlash.value = null;

        currentStage.value = STAGE.SELECT_BOARD;
    }

    function resetFirmwareSelection() {

        alert.value = false;
        firmwareId.value = null;
        firmware.value = null;
        configFormEntries.value = null;
        configData.value = null;

        currentStage.value = STAGE.SELECT_FIRMWARE;
    }

</script>

<template>

    <v-empty-state
        v-if="loadError"
        title="Board can't be flashed now"
    />

    <template
        v-if="!loadError"
    >

        <Stepper
            :model-value="currentStage"
            :steps="stages"
        />

        <Overview
            :board-name="boardToFlash?.name"
            :firmware-name="firmware?.name"
        />

        <v-alert
            v-if="alert"
            @click:close="alert = false"
            type="error"
            :title="alertTitle"
            :text="alertText"
        />

        <SelectBoard
            v-if="currentStage === STAGE.SELECT_BOARD"
            v-model="boardToFlash"
            :boards="boards"
            @click-select="selectBoard"
        />

        <SelectFirmware
            v-if="currentStage === STAGE.SELECT_FIRMWARE"
            v-model="firmwareId"
            @click-select="selectFirmware"
            @click-back="resetBoardSelection"
        />

        <ConfigureFirmware
            v-if="currentStage === STAGE.CONFIGURE"
            :firmware="firmware"
            @click-flash="flash"
            @click-back="resetFirmwareSelection"
        >

            <ConfigForm
                ref="form"
                v-model="configData"
                :entries="configFormEntries"
            />

        </ConfigureFirmware>

    </template>

</template>