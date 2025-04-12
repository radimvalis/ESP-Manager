
const endpoint = Object.freeze({

    auth: {

        logIn: () => "/auth/login",
        signUp: () => "/auth/signup",
        logOut: () => "/auth/logout",
        refreshTokens: () => "/auth/refresh"
    },

    users: {

        me: () => "/users/me"
    },

    files: {

        default: {

            firmware: (id=":id") => `/files/default/firmware/${id}`,
            configForm: () => "/files/default/config-form",
            bootloader: (id=":id") => `/files/default/bootloader/${id}`,
            partitionTable: (id=":id") => `/files/default/partition-table/${id}`,
            NVS: (id=":id") => `/files/default/nvs/${id}`,
        },

        firmware: (id=":id") => `/files/firmware/${id}`,
        configForm: (id=":id") => `/files/config-form/${id}`,
        nvs: (id=":id") => `/files/nvs/${id}`
    },

    boards: {

        supportedChips: () => "/boards/chips",
        all: () => "/boards",
        watchAll: () => "/boards/watch",
        one: (id=":id") => `/boards/${id}`,
        watchOne: (id=":id") => `/boards/${id}/watch`,
    },

    firmwares: {

        all: () => "/firmwares",
        one: (id=":id") => `/firmwares/${id}`
    }
});

const boardUpdateType = Object.freeze({

    flashBoard: "flash",
    updateFirmware: "updateFirmware",
    bootDefaultFirmware: "defaulFirmware"
});

export { endpoint, boardUpdateType };