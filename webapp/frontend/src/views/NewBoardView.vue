
<script setup>

    import Flasher from "@/utils/Flasher";

    async function connect() {

        const flasher = new Flasher();

        await flasher.connect();
    }

</script>

<template>

    <h1>
        New Board
    </h1>

    <v-btn
        @click="connect"
    >
        Connect
    </v-btn>

</template>