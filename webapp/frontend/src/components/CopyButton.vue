
<script setup>

    const props = defineProps({ textToCopy: String });

    /**
     * Saves text to clipboard
     */
    async function copyToClipboard() {
        
        try {

            await navigator.clipboard.writeText(props.textToCopy);
        }

        catch(e) {

        }
    }

</script>

<template>

    <v-btn
        @click="copyToClipboard"
        icon="mdi-content-copy"
        variant="text"
    />

</template>