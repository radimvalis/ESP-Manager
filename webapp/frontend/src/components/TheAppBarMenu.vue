
<script setup>

    import { useRouter } from "vue-router";
    import { useSessionStore } from '@/stores/session';

    const router = useRouter();

    const avatarText = useSessionStore().username.charAt(0).toUpperCase();

    async function logOut() {

        await useSessionStore().api.auth.logOut();

        useSessionStore().logOut();

        router.push({ name: "LogIn" });
    }

</script>

<template>

    <v-menu>

        <template v-slot:activator="{ props }">

            <v-btn
                icon
                v-bind="props"
            >

                <v-avatar
                    color="surface"
                >
                    {{ avatarText }}
                </v-avatar>

            </v-btn>

        </template>

        <v-card>

            <v-list>

                <v-list-item
                    :title="useSessionStore().username"
                >

                    <template v-slot:prepend>

                        <v-avatar
                            variant="outlined"
                        >

                            {{ avatarText }}

                        </v-avatar>

                    </template>

                </v-list-item>

            </v-list>

            <v-divider/>

            <v-list>

                <v-list-item
                    title="log out"
                    prepend-icon="mdi-logout"
                    @click="logOut"
                />

            </v-list>

        </v-card>

    </v-menu>

</template>