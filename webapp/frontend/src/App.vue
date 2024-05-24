
<script setup>

    import { useSessionStore } from '@/stores/session';
    import { RouterView } from "vue-router";
    import TheAppBar from "@/components/TheAppBar.vue";

    useSessionStore().init();

</script>

<template>

    <v-app>

        <TheAppBar/>

        <v-main>

            <RouterView/>

        </v-main>

    </v-app>

</template>
