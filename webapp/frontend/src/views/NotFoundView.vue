
<script setup>

    import { useRouter } from "vue-router";
    import { useSessionStore } from '@/stores/session';

    const router = useRouter();
    const session = useSessionStore();

    function returnHome() {

        router.push(session.isLoggedIn ? { name: "Boards" } : { name: "LogIn" });
    }

</script>

<template>

    <v-empty-state
        headline="Whoops, 404"
        text="The page you were looking for does not exist."
    >

        <v-btn
            @click="returnHome()"
            icon="mdi-home"
            variant="plain"
        />

    </v-empty-state>

</template>