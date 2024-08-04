
<script setup>

    import { defineEmits } from "vue";

    const CLICK_REGISTER_EVENT = "click-register";

    defineEmits([ CLICK_REGISTER_EVENT ]);

</script>


<template>

    <v-card
        class="mx-auto"
        max-width="600"
    >

        <v-card-title
            class="my-6 text-wrap"
        >

            Configure your board

        </v-card-title>

        <v-divider/>

        <v-card-text>

            <slot></slot>

        </v-card-text>

        <v-card-actions>

            <v-spacer/>

            <v-btn
                @click="$emit(CLICK_REGISTER_EVENT)"
            >

                Register

            </v-btn>

        </v-card-actions>

    </v-card>

</template>