
<script setup>

    import { ref, onMounted } from "vue";
    import { useRoute } from "vue-router";
    import { useSessionStore } from "@/stores/session";

    const route = useRoute();
    const session = useSessionStore();

    const board = ref(null);

    onMounted(async () => {

        try {

            board.value = await session.api.board.get(route.params.id);
        }

        catch(error) {

        }
    });

</script>

<template>

    <template
        v-if="board"
    >

    <h1>

        Board: {{ board.name }}

    </h1>

    <h3>

        ID: {{ board.id }}

    </h3>

    </template>

</template>