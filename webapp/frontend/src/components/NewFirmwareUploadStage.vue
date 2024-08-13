
<script setup>

    import { defineEmits } from "vue";

    const CLICK_UPLOAD_EVENT = "click-upload";

    defineEmits([ CLICK_UPLOAD_EVENT ]);

</script>

<template>

    <v-card
        class="mx-auto"
        max-width="600"
    >

        <v-card-title
            class="my-6 text-wrap"
        >

            Upload your firmware

        </v-card-title>

        <v-divider/>

        <v-card-text
            class="text-justify"
        >

            <slot></slot>

        </v-card-text>

        <v-card-actions>

            <v-spacer/>

            <v-btn
                @click="$emit(CLICK_UPLOAD_EVENT)"
            >

                Upload

            </v-btn>

        </v-card-actions>

    </v-card>

</template>