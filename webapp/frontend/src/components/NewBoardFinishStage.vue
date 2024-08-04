
<script setup>

    import { defineEmits } from "vue";

    const CLICK_INSPECT_EVENT = "click-inspect";

    defineEmits([ CLICK_INSPECT_EVENT ]);

    defineProps({ boardName: String });

</script>

<template>

    <v-card
        class="mx-auto"
        max-width="600"
    >

        <template #prepend>

            <v-icon
                icon="mdi-check-circle"
                color="success"
            />

        </template>

        <template #title>

            <div
                class="my-6 text-wrap"
            >

                The board <b>{{ boardName }}</b> has been successfully registered

            </div>

        </template>

        <v-divider/>
        
        <v-card-actions>

            <v-spacer/>

            <v-btn
                @click="$emit(CLICK_INSPECT_EVENT)"
            >

                Inspect

            </v-btn>

        </v-card-actions>

    </v-card>

</template>