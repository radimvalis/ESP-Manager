
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

                    Connection failed ...

                </v-list-item-title>

                <template #append>

                    <v-btn
                        @click="model = false"
                        icon="mdi-close"
                        variant="text"
                    />

                </template>

            </v-list-item>

        </v-list>

    </v-dialog>

</template>