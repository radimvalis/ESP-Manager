
<script setup>

    import ConfigLabel from "@/components/ConfigFormInputLabel.vue";
    import Tooltip from "@/components/ConfigFormInputTooltip.vue";

    const model = defineModel({ default: "" });

    const props = defineProps({

        label: { type: String, required: true },
        isRequired: { type: Boolean, required: true },
        description: { type: String }
    });

    const validationRules = [

        () => props.isRequired ? (model.value === "" ? "This field is required" : true) : true
    ];

</script>

<template>

    <v-textarea
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

    </v-textarea>

</template>