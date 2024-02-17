
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
                        Sign Up
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

                            <v-text-field
                                label="Confirm Password"
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
