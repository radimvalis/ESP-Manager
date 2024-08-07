
<template>

    <v-container
        class="fill-height"
        >

            <v-row>

                <v-col>

                    <v-card
                        class="mx-auto text-center"
                        variant="flat"
                        color="background"
                    >

                        <v-card-text>

                            <v-icon
                                icon="mdi-alert"
                                color="error"
                                :size="50"
                            />

                        </v-card-text>

                        <v-card-title
                            class="text-wrap"
                        >

                            Board registration is not possible

                        </v-card-title>
                        
                        <v-card-text
                            class="text-wrap"
                        >

                            Try a browser that supports Web Serial API:

                        </v-card-text>

                        <v-card-actions>

                            <v-spacer/>

                            <v-btn
                                icon="mdi-google-chrome"
                                variant="plain"
                                href="https://www.google.com/chrome/"
                                target="_blank"
                            />

                            <v-btn
                                icon="mdi-microsoft-edge"
                                variant="plain"
                                href="https://www.microsoft.com/edge"
                                target="_blank"
                            />

                            <v-btn
                                icon="mdi-opera"
                                variant="plain"
                                href="https://www.opera.com/"
                                target="_blank"
                            />

                            <v-spacer/>

                        </v-card-actions>

                    </v-card>

                </v-col>

            </v-row>

        </v-container>

</template>