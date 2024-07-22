
<script setup>

defineProps({ text: String });

</script>

<template>

    <v-tooltip
        :text="text"
        location="bottom"
        max-width="250"
    >

        <template #activator="{ props }">

            <v-icon
                v-bind="props"
                icon="mdi-information-outline"
            />

        </template>

    </v-tooltip>

</template>