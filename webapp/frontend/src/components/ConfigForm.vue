
<script setup>

    import { ref } from "vue";
    import StringInput from "@/components/ConfigFormStringInput.vue";
    import BlobInput from "@/components/ConfigFormBlobInput.vue";
    import NumberInput from "@/components/ConfigFormNumberInput.vue";

    const configData = defineModel({ type: Object });

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
            v-for="entry in entries"
        >

            <StringInput
                v-if='entry.encoding === "string"'
                v-model="configData[entry.key]"
                v-bind="entry"
                class="mt-2"
                density="compact"
            />

            <BlobInput
                v-else-if='entry.encoding === "blob"'
                v-model="configData[entry.key]"
                v-bind="entry"
                class="mt-2"
                density="compact"
            />

            <NumberInput
                v-else-if='numberEncodings.includes(entry.encoding)'
                v-model="configData[entry.key]"
                v-bind="entry"
                class="mt-2"
                density="compact"
            />

        </template>

        <p
            class="text-medium-emphasis"
        >

            Fields marked with an <span :style='{ color: "#B00020" }'>*</span> are required.

        </p>

    </v-form>

</template>