
<script setup>

    import { ref } from "vue";
    import { RouterLink, useRouter } from "vue-router";
    import { useSessionStore } from "@/stores/session";

    const router = useRouter();
    const session = useSessionStore();

    const form = ref(null);
    const username = ref("");
    const password = ref("");

    const usernameRules = [

        (x) => !!x || "Username is required",
        (x) => /^[a-z0-9]+$/i.test(x) || "Only alphanumeric characters are allowed",
    ];
    const passwordRules = [
                    
        (x) => !!x || "Password is required",
    ];

    async function logIn() {

        const { valid } = await form.value.validate();

        if (valid) {

            await session.api.auth.logIn(username.value, password.value);

            router.push("/boards");
        }
    }

</script>

<template>
    
    <v-container
        class="fill-height"
    >

        <v-row>

            <v-col
                class="justify-center align-center"
            >

                <v-card
                    max-width="400"
                    class="mx-auto"
                >

                    <v-card-title
                        class="my-6"
                    >
                        Log In
                    </v-card-title>

                    <v-card-text>

                        <v-form
                            ref="form"
                        >

                            <v-text-field
                                v-model="username"
                                :rules="usernameRules"
                                class="my-2"
                                label="Username"
                                required
                                variant="outlined"
                                color="primary"
                            />

                            <v-text-field
                                v-model="password"
                                :rules="passwordRules"
                                class="my-2"
                                label="Password"
                                type="password"
                                required
                                variant="outlined"
                                color="primary"
                            />

                            <v-btn
                                block
                                size="x-large"
                                variant="flat"
                                color="primary"
                                @click="logIn"
                            >
                                Log In
                            </v-btn>

                        </v-form>

                        <br>

                        <v-divider/>

                        <br>

                        Don't have an account?

                        <RouterLink
                            to="/signup"
                            style="text-decoration: none; color: #336699;"
                        >
                            Sign up
                        </RouterLink>

                    </v-card-text>

                </v-card>

            </v-col>

        </v-row>

    </v-container>

</template>
