
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
        },

        CONFIG_FORM: "/file/config-form",
        FIRMWARE_ANY: "/file/firmware/:id",
        NVS_ANY: "/file/nvs/:id"
    },

    BOARD: {

        GET: "/board/get",
        SUMMARY_LIST: "/board/summary-list",
        REGISTER: "/board/register",
        FLASH: "/board/flash",
        UPDATE: "/board/update",
        BOOT_DEFAULT: "/board/boot-default",
        DELETE: "/board/delete",
        WATCH_ONE: "/board/watch/:id",
        WATCH_ALL: "/board/watch-all"
    },

    FIRMWARE: {

        GET: "/firmware/get",
        GET_PUBLIC: "/firmware/get-public",
        SUMMARY_LIST: "/firmware/summary-list",
        CREATE: "/firmware/create",
        UPDATE: "/firmware/update",
        DELETE: "/firmware/delete"
    }
}

export { ENDPOINT };