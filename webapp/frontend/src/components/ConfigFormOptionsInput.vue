
<script setup>

    import { ref, watch } from "vue";
    import ConfigLabel from "@/components/ConfigFormInputLabel.vue";
    import Tooltip from "@/components/ConfigFormInputTooltip.vue";

    const model = defineModel({ default: "" });

    const props = defineProps({

        label: { type: String, required: true },
        isRequired: { type: Boolean, required: true },
        options: { type: Array, required: true },
        description: { type: String }
    });

    const inputModel = ref(null);
    
    watch(inputModel, (newValue) => {

        model.value = newValue === null ? "" : newValue; 
    });

</script>

<template>

    <v-select
        v-model="inputModel"
        :items="options"
        clearable
        variant="outlined"
    >

        <template #label>

            <ConfigLabel
                :text="label"
                :is-required="isRequired"
            />

        </template>

        <template #append
            v-if="description"
        >

            <Tooltip
                :text="description"
            />

        </template>

    </v-select>

</template>