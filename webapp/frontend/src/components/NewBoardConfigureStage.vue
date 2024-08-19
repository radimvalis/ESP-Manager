
<script setup>

    import { defineEmits } from "vue";

    const CLICK_REGISTER_EVENT = "click-register";

    defineEmits([ CLICK_REGISTER_EVENT ]);

</script>


<template>

    <v-card-main>

        <v-card-title>

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

    </v-card-main>

</template>