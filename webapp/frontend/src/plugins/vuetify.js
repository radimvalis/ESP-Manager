
import "vuetify/styles";

import { createVuetify } from "vuetify";
import { VCard } from "vuetify/components/VCard";
import { VSheet } from "vuetify/components/VSheet";

const customLightTheme = {

    dark: false,
    colors: {

        background: "#F2F2F2",
        surface: "#FFFFFF",
        primary: "#336699",
        secondary: "#A69D6D",
        error: "#B00020",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FB8C00",
    },
};

const vuetify = createVuetify({

    aliases: {

        VCardMain: VCard,
        VCardInfo: VCard,
        VSheetMain: VSheet
    },
    defaults: {

        VCardMain: {

            class: [ "mx-auto", "mt-sm-4", "mt-xs-0", "text-justify", "responsive-border" ],
            maxWidth: 600,
            VCardTitle: {

                class: [ "my-4", "text-wrap" ]
            },
            VCardSubtitle: {

                class: [ "mb-4" ]
            },
            VCardActions: {

                VBtn: {

                    class: [ "mx-2", "mb-4" ],
                    variant: "flat",
                    color: "primary"
                }
            }
        },
        VCardInfo: {

            class: [ "mx-auto", "text-center" ],
            color: "background",
            variant: "flat"
        },
        VSheetMain : {

            class: [ "mx-auto", "mt-sm-4", "mt-xs-0", "responsive-border" ],
            maxWidth: 1200,
            elevation: 1,
        },
        VAlert: {

            class: [ "mx-auto", "mt-sm-4", "mt-xs-0", "responsive-border" ],
            maxWidth: 600,
            variant: "elevated",
            closable: true
        },
        VEmptyState: {

            icon: "mdi-close-circle",
            color: "error"
        }
    },
    theme: {

        defaultTheme: "customLightTheme",
        themes: {

            customLightTheme
        },
    },    
});

export default vuetify;