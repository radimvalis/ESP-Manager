
import "vuetify/styles";

import { createVuetify } from "vuetify";

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

    theme: {

        defaultTheme: "customLightTheme",
        themes: {

            customLightTheme
        },
    },    
});

export default vuetify;