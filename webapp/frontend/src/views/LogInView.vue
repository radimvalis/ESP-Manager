
<script setup>

    import { RouterLink } from "vue-router";

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

                        <v-form>

                            <v-text-field
                                label="Username"
                                required
                                variant="outlined"
                                color="primary"
                            />

                            <v-text-field
                                label="Password"
                                type="password"
                                required
                                variant="outlined"
                                color="primary"
                            />

                            <v-btn
                                block
                                size="large"
                                variant="flat"
                                color="primary"
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
