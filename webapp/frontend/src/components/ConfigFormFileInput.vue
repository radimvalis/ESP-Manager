
<script setup>

    import { watch } from "vue";
    import ConfigLabel from "@/components/ConfigFormInputLabel.vue";
    import Tooltip from "@/components/ConfigFormInputTooltip.vue";

    const model = defineModel({ default: null });

    const props = defineProps({

        label: { type: String, required: true },
        isRequired: { type: Boolean, required: true },
        description: { type: String },
        format: { type: String }
    });

    const validationRules = [

        () => props.isRequired ? (model.value !== null) : true,
        () => props.format && model.value ? (props.format !== model.value.type ? "This is not " + props.format + " file" : true) : true
    ]

    watch(model, (newValue) => {

        model.value = newValue === null ? undefined : newValue;
    });

</script>

<template>

    <v-file-input
        v-model="model"
        :rules="validationRules"
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

    </v-file-input>

</template>