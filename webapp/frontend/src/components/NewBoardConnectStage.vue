
<script setup>

    import { defineEmits } from "vue";

    const CLICK_CONNECT_EVENT = "click-connect";

    defineEmits([ CLICK_CONNECT_EVENT ]);

</script>

<template>

    <v-card-main>

        <v-card-title>

            Connect your board

        </v-card-title>

        <v-divider/>

        <v-card-text>

            Connect your board to the PC using the USB cable and click the <b>CONNECT</b> button.
            You'll be then prompted to select the port your board is connected to.

        </v-card-text>

        <v-card-actions>

            <v-spacer/>

            <v-btn
                @click="$emit(CLICK_CONNECT_EVENT)"
            >

                Connect

            </v-btn>

        </v-card-actions>

    </v-card-main>

</template>