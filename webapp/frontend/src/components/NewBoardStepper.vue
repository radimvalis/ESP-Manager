
<script setup>

    import { useDisplay } from "vuetify";

    defineProps({ modelValue: Number, stage: Object });

    const { smAndDown } = useDisplay();

</script>

<template>

    <v-stepper
        :model-value="modelValue"
        class="mx-auto mt-5"
        :mobile="smAndDown"
        max-width="600"
        alt-labels
        flat
    >

        <v-stepper-header
            class="elevation-0"
            :style='{ background:"#F2F2F2" }'
        >

            <v-stepper-item
                :value="stage.CONNECT"
                :complete="modelValue > stage.CONNECT"
                :color='modelValue > stage.CONNECT ? "success" : undefined'
                title="Connect"
            />

            <v-divider/>

            <v-stepper-item
                :value="stage.CONFIGURE"
                :complete="modelValue > stage.CONFIGURE"
                :color='modelValue > stage.CONFIGURE ? "success" : undefined'
                title="Configure"
            />

            <v-divider/>

            <v-stepper-item
                :value="stage.FINISH"
                :complete="modelValue > stage.FINISH"
                :color='modelValue > stage.FINISH ? "success" : undefined'
                title="Finish"
            />

        </v-stepper-header>

    </v-stepper>

</template>