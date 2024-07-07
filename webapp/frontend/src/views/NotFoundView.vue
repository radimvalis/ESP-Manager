
<script setup>

    import { useSessionStore } from '@/stores/session';

</script>

<template>

    <h1>
        Page Not Found
    </h1>

    <v-btn
        :to='useSessionStore().isLoggedIn ? { name: "Boards" } : { name: "LogIn" }' 
    >
        Return Home
    </v-btn>

</template>