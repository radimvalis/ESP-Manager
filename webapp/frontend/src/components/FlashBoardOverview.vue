
<script setup>

    import { useDisplay } from "vuetify";

    defineProps({ boardName: String, firmwareName: String });

    const { xs } = useDisplay();

</script>

<template>

    <v-card-main>

        <v-card-title>

            Overview

        </v-card-title>

        <v-divider/>

        <v-card-text>

            <v-container>

                <v-row>

                    <v-col
                        class="text-center"
                        :cols="12"
                        :sm="4"
                    >

                        <div
                            class="font-weight-bold"
                        >

                            {{ firmwareName ? firmwareName : "?" }}

                        </div>

                        <div
                            class="font-weight-thin"
                        >

                            Firmware

                        </div>

                    </v-col>

                    <v-col
                        class="text-center align-self-center"
                        :cols="12"
                        :sm="4"
                    >

                        <v-icon
                            :icon='xs ? "mdi-arrow-down" : "mdi-arrow-right"'
                            size="x-large"
                        />

                    </v-col>

                    <v-col
                        class="text-center"
                        :cols="12"
                        :sm="4"
                    >

                        <div
                            class="font-weight-bold"
                        >

                            {{ boardName ? boardName : "?" }}

                        </div>

                        <div
                            class="font-weight-thin"
                        >

                            Board

                        </div>

                    </v-col>

                </v-row>

            </v-container>

        </v-card-text>

    </v-card-main>

</template>