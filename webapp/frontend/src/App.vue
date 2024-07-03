
<script setup>

    import { RouterView } from "vue-router";
    import TheAppBar from "@/components/TheAppBar.vue";

</script>

<template>

    <v-app>

        <TheAppBar/>

        <v-main>

            <RouterView/>

        </v-main>

    </v-app>

</template>
