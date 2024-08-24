
<script setup>

    import { ref, onMounted } from "vue";
    import { useRoute } from "vue-router";
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
    const session = useSessionStore();

    const currentStage = ref(null);

    const alert = ref(false);
    const alertType = ref(null);
    const alertTitle = ref(null);

    const boards = ref([]);

    const boardToFlash = ref(null);

    const firmwareId = ref(null);
    const firmware = ref(null);

    const form = ref(null);
    const configFormEntries = ref(null);
    const configData = ref(null);

    onMounted(async () => {

        try {

            boards.value = await session.api.board.getSummaryList();

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

        }
    });

    function selectBoard() {

        currentStage.value = STAGE.SELECT_FIRMWARE;
    }

    async function selectFirmware() {

        try {

            alert.value = false;

            const data = await Promise.all([

                session.api.firmware.getPublic(firmwareId.value),
                session.api.file.getConfigForm(firmwareId.value)
            ]);

            firmware.value = data[0];

            configFormEntries.value = data[1];

            configData.value = {};

            configFormEntries.value.forEach((entry) => {

                configData.value[entry.key] = "";
            });

            currentStage.value = STAGE.CONFIGURE;
        }

        catch(error) {

            firmwareId.value = null;

            alertTitle.value = "Firmware not found";
            alertType.value = "error";
            alert.value = true;
        }
    }

    async function flash() {

        // TODO
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

    <Stepper
        :model-value="currentStage"
        :steps="stages"
    />

    <v-alert
        v-if="alert"
        @click:close="alert = false"
        :type="alertType"
        :title="alertTitle"
    />

    <Overview
        :board-name="boardToFlash?.name"
        :firmware-name="firmware?.name"
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