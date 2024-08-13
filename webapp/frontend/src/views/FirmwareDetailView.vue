
<script setup>

    import { ref, onMounted } from "vue";
    import { useRoute } from "vue-router";
    import { useSessionStore } from "@/stores/session";

    const route = useRoute();
    const session = useSessionStore();

    const firmware = ref(null);

    onMounted(async () => {

        try {

            firmware.value = await session.api.firmware.get(route.params.id);
        }

        catch(error) {

        }
    });

</script>

<template>

    <template
        v-if="firmware"
    >

    <h1>

        Firmware: {{ firmware.name }}

    </h1>

    <h3>

        ID: {{ firmware.id }}

    </h3>

    </template>

</template>