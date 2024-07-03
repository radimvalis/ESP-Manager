
<script setup>

    import { useRouter } from "vue-router";

    import { useSessionStore } from '@/stores/session';

    const router = useRouter();
    const session = useSessionStore();

    async function logOut() {

        await session.api.auth.logOut();

        session.username = null;
        session.isLoggedIn = false;

        router.push("/login");
    }

</script>

<template>

    <h1>
        Boards
    </h1>

    <v-btn
        @click="logOut"
    >
        Log Out
    </v-btn>

</template>