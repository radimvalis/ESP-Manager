
<script setup>

    defineProps({
        
        title: { type: String, required: true },
        icon: { type: String, required: true },
        text: { type: String, required: false, default: undefined },
        color: { type: String, required: false, default: undefined }
    });

</script>

<template>

    <v-card
        class="mx-auto"
        max-width="600"
    >

        <template #prepend>

            <v-icon
                :icon="icon"
                :color="color"
            />

        </template>

        <template #title>

            <div
                class="my-6 text-wrap"
            >

                {{ title }}

            </div>

        </template>
        
        <v-divider/>

        <v-card-text
            class="text-justify"
        >

            {{ text }}

        </v-card-text>
        
        <v-card-actions>

            <v-spacer/>
            
            <slot></slot>

        </v-card-actions>

    </v-card>

</template>