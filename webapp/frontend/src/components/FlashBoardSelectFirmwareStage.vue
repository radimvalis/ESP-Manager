
<script setup>

    const CLICK_SELECT_EVENT = "click-select";
    const CLICK_BACK_EVENT = "click-back";

    defineEmits([ CLICK_SELECT_EVENT, CLICK_BACK_EVENT ]);

    const firmwareId = defineModel({ firmwareId: String });

</script>

<template>

    <v-card-main>

        <v-card-title>

            Select firmware

        </v-card-title>

        <v-divider/>

        <v-card-text>

            <v-text-field
                v-model="firmwareId"
                density="compact"
                variant="outlined"
                prepend-inner-icon="mdi-magnify"
                placeholder="Firmware ID"
                hide-details
                clearable
            />

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
                @click="$emit(CLICK_SELECT_EVENT)"
                :disabled="!firmwareId"
            >

                Select

            </v-btn>

        </v-card-actions>

    </v-card-main>

</template>