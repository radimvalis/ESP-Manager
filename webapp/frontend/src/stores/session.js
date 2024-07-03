
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
    
                    this.logIn(username);
                }
    
                catch(error) {
    
                    this.isLoggedIn = false;
                }
            }
        },

        logIn(username) {

            this.username = username;
            this.isLoggedIn = true;
        },

        logOut() {

            this.username = null;
            this.isLoggedIn = false;
        }
    }
});