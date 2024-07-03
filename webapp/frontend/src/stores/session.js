
import { defineStore } from "pinia";

import ApiProvider from "@/api";

export const useSessionStore = defineStore("session", {

    state: () => ({

        username: null,
        isLoggedIn: null,
        api: null
    }),

    getters: {

        isInitialized() {

            return this.isLoggedIn !== null;
        }
    },

    actions: {

        async init() {

            if (!this.isInitialized) {

                this.api = new ApiProvider();

                try {
    
                    const { username } = await this.api.user.get();
    
                    this.username = username;
                    this.isLoggedIn = true;
                }
    
                catch(error) {
    
                    this.isLoggedIn = false;
                }
            }
        }
    }
});