
<script setup>

    import { useSessionStore } from '@/stores/session';
    import AppBarMenu from "@/components/TheAppBarMenu.vue";

</script>

<template>

    <v-app-bar
        v-if="useSessionStore().isLoggedIn"
        density="compact"
        color="primary"
    >

        <v-app-bar-title>
            ESP Manager
        </v-app-bar-title>

        <template v-slot:append>

            <AppBarMenu/>

        </template>

        <template v-slot:extension>

            <v-container>

                <v-row>

                    <v-col>

                        <v-tabs
                            fixed-tabs
                            align-tabs="center"
                        >

                            <v-tab
                                :to='{ name: "Boards" }'
                            >
                                Boards
                            </v-tab>

                            <v-tab
                                :to='{ name: "Firmwares" }'
                            >
                                Firmwares
                            </v-tab>
                            
                        </v-tabs>

                    </v-col>

                </v-row>

            </v-container>

        </template>

    </v-app-bar>

</template>
