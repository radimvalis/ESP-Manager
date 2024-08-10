
<script setup>

    import { useDisplay } from "vuetify";

    defineProps({ modelValue: Number, steps: Array });

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

            <template
                v-for="(step, i) in steps" :key="i"
            >

                <v-divider
                    v-if="i"
                />

                <v-stepper-item
                    :value="step.value"
                    :complete="modelValue > step.value"
                    :color='modelValue > step.value ? "success" : undefined'
                    :title="step.title"
                />

            </template>

        </v-stepper-header>

    </v-stepper>

</template>