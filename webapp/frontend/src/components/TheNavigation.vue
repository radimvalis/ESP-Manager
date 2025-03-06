
<script setup>

    import { ref } from "vue";
    import { useRouter } from "vue-router";
    import { useSessionStore } from "@/stores/session";

    const router = useRouter();

    const drawer = ref(false);

    async function logOut() {

        await useSessionStore().api.auth.logOut();

        useSessionStore().logOut();

        router.push({ name: "LogIn" });
    }

</script>

<template>

    <template
        v-if="useSessionStore().isLoggedIn"
    >

        <v-app-bar
            density="compact"
            color="primary"
        >

            <v-app-bar-title>

                ESP Manager
                
            </v-app-bar-title>

            <template v-slot:append>

                <v-btn
                    icon="mdi-menu"
                    @click="drawer = !drawer"
                />

            </template>

            <template v-slot:extension>

                <v-container>

                    <v-row>

                        <v-col>

                            <v-tabs
                                fixed-tabs
                                hide-slider
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

        <v-navigation-drawer
            v-model="drawer"
            temporary
            location="right"
            :width="250"
        >

            <div
                class="d-flex flex-column pa-4 text-center text-h6"
            >

                <v-avatar
                    class="mx-auto mb-4"
                    variant="outlined"
                    size="50"
                    
                >
                    
                    {{ useSessionStore().username.charAt(0) }}

                </v-avatar>

                {{ useSessionStore().username }}

            </div>

            <v-divider/>
                
            <template #append>

                <div
                    class="pa-4"
                >

                    <v-btn
                        @click="logOut"
                        block
                        color="primary"
                        prepend-icon="mdi-logout"
                    >
                        Log out
                    </v-btn>

                </div>

            </template>

        </v-navigation-drawer>

    </template>

</template>
