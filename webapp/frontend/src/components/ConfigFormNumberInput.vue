
<script setup>

    import { ref, watch } from "vue";
    import OptionsInput from "@/components/ConfigFormOptionsInput.vue";
    import ConfigLabel from "@/components/ConfigFormInputLabel.vue";
    import Tooltip from "@/components/ConfigFormInputTooltip.vue";

    const EMPTY = "";
    const INVALID = null;

    const model = defineModel({ default: EMPTY });

    const props = defineProps({

        label: { type: String, required: true },
        isRequired: { type: Boolean, required: true },
        options: { type: Array },
        description: { type: String },
        minimum: { type: Number },
        maximum: { type: Number }
    });

    const inputModel = ref(EMPTY);

    const validationRules = [

        () => props.isRequired ? (model.value !== EMPTY) : true,
        () => model.value === INVALID ? "Not a valid number" : true,
        () => props.minimum !== undefined && model.value !== INVALID && model.value !== EMPTY ? (model.value < props.minimum ? "The number must not be less than " + props.minimum : true) : true,
        () => props.maximum !== undefined && model.value !== INVALID && model.value !== EMPTY ? (model.value > props.maximum ? "The number must not be greater than " + props.maximum : true) : true
    ];

    watch(inputModel, (newValue) => {

        const isValid = /^0$|^-?([1-9]\d*)$/.test(newValue);

        if (!isValid) {

            model.value = newValue === EMPTY ? EMPTY : INVALID;
        }

        else {

            model.value = parseFloat(newValue);
        }
    });

    watch(model, (newValue) => {

        model.value = newValue === "" ? undefined : newValue; 
    });

    function validateBeforeInput(event) {

        if (event.inputType === "insertFromPaste" && !/^0$|^-?([1-9]\d*)$/.test(event.data)) {

            event.preventDefault();
        }

        else if (event.inputType === "insertText" && !/^-?\d*$/.test(event.data)) {

            event.preventDefault();
        }
    }

</script>

<template>

    <OptionsInput
        v-if="options"
        v-model="inputModel"
        v-bind="props"
        :rules="validationRules"
    />

    <v-text-field
        v-else
        v-model="inputModel"
        :rules="validationRules"
        @beforeinput="validateBeforeInput"
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