
<script setup>

    const model = defineModel({ default: false });

</script>

<template>

    <v-dialog
        v-model="model"
        persistent
        width="300"
    >

        <v-list
            rounded="lg"
        >

            <v-list-item>

                <v-list-item-title>

                    Connecting to board ...

                </v-list-item-title>

                <template #append>

                    <v-progress-circular
                        indeterminate
                        :size="40"
                        color="primary"
                    />

                </template>

            </v-list-item>

        </v-list>

    </v-dialog>

</template>