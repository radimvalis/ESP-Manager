<script setup>

    const CLICK_FLASH_EVENT = "click-flash";
    const CLICK_BACK_EVENT = "click-back";

    defineEmits([ CLICK_FLASH_EVENT, CLICK_BACK_EVENT ]);

</script>

<template>

    <v-card-main>

        <v-card-title>

            Configure firmware

        </v-card-title>

        <v-divider/>

        <v-card-text>

            <slot></slot>

        </v-card-text>

        <v-card-actions>

            <v-btn
                @click="$emit(CLICK_BACK_EVENT)"
                variant="outlined"
            >

                Back

            </v-btn>

            <v-spacer/>

            <v-btn
                @click="$emit(CLICK_FLASH_EVENT)"
            >

                Flash

            </v-btn>

        </v-card-actions>

    </v-card-main>

</template>