
<script setup>

    import { ref } from "vue";
    import TextInput from "@/components/ConfigFormTextInput.vue";
    import FileInput from "@/components/ConfigFormFileInput.vue";
    import NumberInput from "@/components/ConfigFormNumberInput.vue";
    import RequiredFieldsInfo from "@/components/RequiredFieldsInfo.vue";

    const configData = defineModel({ type: Object });

    defineProps({ entries: Array });

    const form = ref(null);

    defineExpose({ form });

    const binaryEncodings = [ "string", "hex2bin", "base64", "binary" ];
    const numberEncodings = [ "u8", "i8", "u16", "i16", "u32", "i32", "u64", "i64" ];

</script>

<template>

    <v-form
        ref="form"
    >

        <template
            v-for="entry in entries"
        >

            <TextInput
                v-if='entry.type === "data" && binaryEncodings.includes(entry.encoding)'
                v-model="configData[entry.key]"
                v-bind="entry"
                class="mt-2"
                density="compact"
            />

            <FileInput
                v-else-if='entry.type === "file" && binaryEncodings.includes(entry.encoding)'
                v-model="configData[entry.key]"
                v-bind="entry"
                class="mt-2"
                density="compact"
            />

            <NumberInput
                v-else-if='entry.type === "data" && numberEncodings.includes(entry.encoding)'
                v-model="configData[entry.key]"
                v-bind="entry"
                class="mt-2"
                density="compact"
            />

        </template>

        <RequiredFieldsInfo
            v-if="entries"
        />

    </v-form>

</template>