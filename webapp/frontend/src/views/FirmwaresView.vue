
<script setup>

    import { useRouter } from "vue-router";

</script>

<template>

    <h1>
        Firmwares
    </h1>

    <v-btn
        :to='{ name: "NewFirmware" }'
        prepend-icon="mdi-plus"
        variant="flat"
        color="primary"
    >
    
        New

    </v-btn>

</template>