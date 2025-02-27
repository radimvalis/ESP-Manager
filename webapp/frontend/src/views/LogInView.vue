
<script setup>

    import { ref } from "vue";
    import { RouterLink, useRouter } from "vue-router";
    import { useSessionStore } from "@/stores/session";

    const router = useRouter();
    const session = useSessionStore();

    const form = ref(null);
    const username = ref("");
    const password = ref("");

    const alert = ref(false);
    const alertText = ref(null);

    const usernameRules = [

        (x) => !!x,
        (x) => 3 <= x.length && x.length <= 20 || "Username must be 3-20 characters",
        (x) => /^[a-z0-9-_.]+$/i.test(x) || "Only letters, numbers, -, _ and . are allowed",
    ];
    const passwordRules = [
                    
        (x) => !!x,
    ];

    async function logIn() {

        const { valid } = await form.value.validate();

        if (valid) {

            try {

                await session.api.auth.logIn(username.value, password.value);

                session.logIn(username.value);

                router.push({ name: "Boards" });
            }

            catch(error) {

                alertText.value = error.response.data.message;
                alert.value = true;
            }
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

                <v-alert
                    v-if="alert"
                    @click:close="alert = false"
                    type="error"
                    :text="alertText"
                    max-width="400"
                    style="border-radius:4px !important"
                />

                <v-card
                    max-width="400"
                    class="mx-auto mt-4"
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
