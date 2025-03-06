
<script setup>

    import { RouterView } from "vue-router";
    import TheNavigation from "@/components/TheNavigation.vue";

</script>

<template>

    <v-app>

        <TheNavigation/>

        <v-main>

            <RouterView/>

        </v-main>

    </v-app>

</template>
