
<script setup>

    defineProps({ text: String, isRequired: Boolean });

</script>

<template>

    {{ text }}

    <span
        v-if="isRequired"
        :style='{ color: "#B00020" }'
    >

        *

    </span>

</template>