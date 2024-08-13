
<script setup>

    import { ref, onMounted } from "vue";
    import { useDisplay } from "vuetify";
    import { RouterLink } from "vue-router";
    import { useSessionStore } from "@/stores/session";

    const session = useSessionStore();

    const { smAndUp } = useDisplay();

    const firmwares = ref([]);

    const isLoading = ref(true);
    const noDataText = ref("No firmware available");

    const nameFilter = ref(null);

    const headers = [

        { 
            title: "Firmware",
            align: "start",
            key: "name"
        },
        { 
            title: "Version",
            align: "start",
            key: "version"
        }
    ];

    onMounted(async () => {

        try {

            isLoading.value = true;

            firmwares.value = await session.api.firmware.getSummaryList();
        }

        catch(error) {

            noDataText.value = "Loading failed";
        }

        finally {

            isLoading.value = false;
        }
    });

</script>

<template>

    <div
        :class='{ "mx-4": smAndUp }'
    >

        <v-sheet
            class="mx-auto"
            :class='{ "mt-5": smAndUp }'
            :max-width="1200"
            :elevation="1"
            :rounded="smAndUp"
        >

            <v-container
                fluid
            >

                <v-row>

                    <v-col
                        :cols="12"
                        :sm="8"
                    >

                        <v-btn
                            :to='{ name: "NewFirmware" }'
                            prepend-icon="mdi-plus"
                            variant="flat"
                            color="primary"
                        >
                        
                            Upload

                        </v-btn>

                    </v-col>

                    <v-col
                        :cols="12"
                        :sm="4"
                    >

                        <v-text-field
                            v-model="nameFilter"
                            density="compact"
                            variant="outlined"
                            prepend-inner-icon="mdi-magnify"
                            placeholder="Firmware"
                            hide-details
                            clearable
                        />

                    </v-col>

                </v-row>

            </v-container>

            <v-data-table
                :headers="headers"
                :items="firmwares"
                :loading="isLoading"
                :search="nameFilter"
                :no-data-text="noDataText"
                items-per-page-text="Firmwares per page:"
                loading-text="Loading firmwares ..."
                hover
            >

                <template #item.name="{ item }">

                    <RouterLink
                        :to='{ name: "FirmwareDetail", params: { id: item.id } }'
                        style="text-decoration: none; color: #336699;"
                    >

                        {{ item.name }}

                    </RouterLink>

                </template>


            </v-data-table>

        </v-sheet>

    </div>

</template>