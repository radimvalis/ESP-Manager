
import { defineStore } from "pinia";

import ApiProvider from "@/api";

export const useSessionStore = defineStore("session", {

    state: () => ({

        api: null
    }),

    actions: {

        init() {

            this.api = new ApiProvider();
        }
    }
});