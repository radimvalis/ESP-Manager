
<script setup>

    import { onMounted } from "vue";
    import OptionsInput from "@/components/ConfigFormOptionsInput.vue";
    import ConfigLabel from "@/components/ConfigFormInputLabel.vue";
    import Tooltip from "@/components/ConfigFormInputTooltip.vue";

    const model = defineModel({ default: "" });

    const props = defineProps({

        label: { type: String, required: true },
        isRequired: { type: Boolean, required: true },
        pattern: { type: String },
        options: { type: Array },
        description: { type: String }
    });

    let regExp = null;

    const validationRules = [

        () => props.isRequired ? (model.value !== "") : true,
        (x) => regExp ? ( !regExp.test(x) ? "This input does not match the pattern: " + props.pattern : true ) : true
    ];

    onMounted(() => {

        if (props.pattern) {

            try {
             
                regExp = new RegExp(props.pattern);
            }
            
            catch (error) {
                
                regExp = null;
            }
        }
    });

</script>

<template>

    <OptionsInput
        v-if="options"
        v-model="model"
        v-bind="props"
        :rules="validationRules"
    />

    <v-text-field
        v-else
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

    </v-text-field>

</template>