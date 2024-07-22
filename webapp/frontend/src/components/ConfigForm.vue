
<script setup>

    import { ref } from "vue";
    import StringInput from "@/components/ConfigFormStringInput.vue";
    import BlobInput from "@/components/ConfigFormBlobInput.vue";
    import NumberInput from "@/components/ConfigFormNumberInput.vue";

    const models = defineModel({ type: Array });

    defineProps({ entries: Array });

    const form = ref(null);

    defineExpose({ form });

    const numberEncodings = [ "uint8_t", "int8_t", "uint16_t", "int16_t", "uint32_t", "int32_t", "uint64_t", "int64_t" ];

</script>

<template>

    <v-form
        ref="form"
    >

        <template
            v-for="(entry, idx) in entries"
        >

            <StringInput
                v-if='entry.encoding === "string"'
                v-model="models[idx]"
                v-bind="entry"
                class="my-2"
            />

            <BlobInput
                v-else-if='entry.encoding === "blob"'
                v-model="models[idx]"
                v-bind="entry"
                class="my-2"
            />

            <NumberInput
                v-else-if='numberEncodings.includes(entry.encoding)'
                v-model="models[idx]"
                v-bind="entry"
                class="my-2"
            />

        </template>

        <p
            class="text-medium-emphasis"
        >

            Fields marked with an <span :style='{ color: "#B00020" }'>*</span> are required.

        </p>

    </v-form>

</template>