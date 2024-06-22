
<script setup>

    import { ref } from "vue";
    import { RouterLink, useRouter } from "vue-router";
    import { useSessionStore } from '@/stores/session';

    const router = useRouter();
    const session = useSessionStore();

    const form = ref(null);
    const username = ref("");
    const password = ref("");
    const passwordConfirmed = ref("");

    const usernameRules = [

        (x) => !!x || "Username is required",
        (x) => /^[a-z0-9]+$/i.test(x) || "Only alphanumeric characters are allowed",
    ];
    const passwordRules = [
                    
        (x) => !!x || "Password is required",
    ];
    const passwordConfirmRules = [

        (x) => !!x || 'Password confirmation is required',
        (x) => !password.value || (password.value && x === password.value) || "Passwords must match"
    ];

    async function signUp() {

        const { valid } = await form.value.validate();

        if (valid) {

            await session.api.auth.signUp(username.value, password.value);

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
                        Sign Up
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

                            <v-text-field
                                v-model="passwordConfirmed"
                                :rules="passwordConfirmRules"
                                class="my-2"
                                label="Confirm Password"
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
                                @click="signUp"
                            >
                                Sign Up
                            </v-btn>

                        </v-form>

                        <br>

                        <v-divider/>

                        <br>

                        Already have an account?

                        <RouterLink
                            to="/login"
                            style="text-decoration: none; color: #336699;"
                        >
                            Log in
                        </RouterLink>

                    </v-card-text>

                </v-card>

            </v-col>

        </v-row>

    </v-container>

</template>
