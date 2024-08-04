
<script setup>

    import { defineEmits } from "vue";

    const CLICK_RETRY_EVENT = "click-retry";

    defineEmits([ CLICK_RETRY_EVENT ]);

</script>

<template>

    <v-card
        class="mx-auto"
        max-width="600"
    >

        <template #prepend>

            <v-icon
                icon="mdi-alert"
                color="error"
            />

        </template>

        <template #title>

            <div
                class="my-6 text-wrap"
            >

                Something went wrong ...

            </div>

        </template>
        
        <v-divider/>

        <v-card-text
            class="text-justify"
        >

            Please unplug the board and plug it back in, then try the registration again.

        </v-card-text>
        
        <v-card-actions>

            <v-spacer/>

            <v-btn
                @click="$emit(CLICK_RETRY_EVENT)"
            >

                Retry

            </v-btn>

        </v-card-actions>

    </v-card>

</template>