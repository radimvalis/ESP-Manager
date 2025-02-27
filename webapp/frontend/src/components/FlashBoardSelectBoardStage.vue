
<script setup>

    import { ref } from "vue";

    const CLICK_SELECT_EVENT = "click-select";

    defineEmits([ CLICK_SELECT_EVENT ]);

    const boardToFlash = defineModel({ boardToFlash: Object });

    defineProps({ boards: Array });

    const filter = ref("");

</script>

<template>

    <v-card-main>

        <v-card-title>

            Select board

        </v-card-title>

        <v-divider/>

        <v-card-text>

            <v-text-field
                v-model="filter"
                density="compact"
                variant="outlined"
                prepend-inner-icon="mdi-magnify"
                placeholder="Board"
                clearable
            />

            <div
                class="pa-2 border-sm rounded"
                style="height: 220px; width: 100%; border-color: #AAAAAA !important;"
            >

                <v-radio-group
                    v-model="boardToFlash"
                >

                    <v-data-iterator
                        :items="boards"
                        :items-per-page="-1"
                        :search="filter"
                    >
                        <template #no-data>

                            <div
                                class="d-flex justify-center align-center"
                                style="height: 202px"
                                :style='{ color: "#B00020" }'
                            >

                                No board found

                            </div>

                        </template>

                        <template #default="{ items }">

                            <v-virtual-scroll
                                :items="items"
                                :height="200"
                            >

                                <template #default="{ item }">

                                    <v-radio
                                        :label="item.raw.name"
                                        :value="item.raw"
                                        color="primary"
                                    />

                                </template>

                            </v-virtual-scroll>

                        </template>

                    </v-data-iterator>
                
                </v-radio-group>

            </div>

        </v-card-text>

        <v-card-actions>

            <v-spacer/>

            <v-btn
                @click="$emit(CLICK_SELECT_EVENT)"
                :disabled="!boardToFlash"
            >

                Select

            </v-btn>

        </v-card-actions>

    </v-card-main>

</template>