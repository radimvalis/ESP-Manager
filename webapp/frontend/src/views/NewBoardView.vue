
<script setup>

    import { ref } from "vue";
    import Flasher from "@/utils/Flasher";
    import { useSessionStore } from "@/stores/session";

    const session = useSessionStore();

    const isBoardConnected = ref(false);

    const flasher = new Flasher();

    async function connect() {

        try {

            await flasher.connect();

            isBoardConnected.value = true;
        }

        catch(error) {

            console.log(error);
        }
    }

    async function register() {

        const firmware = await session.api.file.getDefaultFirmware();
        const bootloader = await session.api.file.getDefaultBootloader();
        const partitionTable = await session.api.file.getDefaultPartitionTable();

        const defaultApp = { firmware, bootloader, partitionTable };

        await flasher.program(defaultApp);
    }

</script>

<template>

    <h1>
        New Board
    </h1>

    <v-btn
        v-if="!isBoardConnected"
        @click="connect"
    >
        Connect
    </v-btn>

    <v-btn
        v-if="isBoardConnected"
        @click="register"
    >
        Register
    </v-btn>

</template>