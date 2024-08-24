
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
        title="Page not found"
        text="The page you were looking for does not exist"
        action-text="Return Home"
        color="primary"
        @click:action="returnHome"
    />

</template>