
const ENDPOINT = {

    AUTH: {

        LOG_IN: "/auth/login",
        SIGN_UP: "/auth/signup",
        LOG_OUT: "/auth/logout",
        REFRESH_TOKENS: "/auth/refresh"
    },

    USER: {

        GET: "/user/get"
    },

    FILE: {

        DEFAULT: {

            ANY: "/file/default/:filename",
            FIRMWARE: "/file/default/firmware",
            PARTITION_TABLE: "/file/default/partition-table",
            BOOTLOADER: "/file/default/bootloader",
            CONFIG_FORM: "/file/default/config-form",
            NVS: "/file/default/nvs"
        }
    },

    BOARD: {

        GET: "/board/get",
        SUMMARY_LIST: "/board/summary-list",
        REGISTER: "/board/register",
        DELETE: "/board/delete"
    },

    FIRMWARE: {

        GET: "/firmware/get",
        SUMMARY_LIST: "/firmware/summary-list",
        CREATE: "/firmware/create",
        UPDATE: "/firmware/update",
        DELETE: "/firmware/delete"
    }
}

export { ENDPOINT };