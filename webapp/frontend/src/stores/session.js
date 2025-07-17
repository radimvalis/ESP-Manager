
import { defineStore } from "pinia";

import ApiProvider from "@/api";

export const useSessionStore = defineStore("session", {

    state: () => ({

        username: null,
        isLoggedIn: null,
        api: null
    }),

    getters: {

        /**
         * Checks if "init" has been already called
         * @returns {boolean}
         */
        isInitialized() {

            return this.isLoggedIn !== null;
        }
    },

    actions: {

        /**
         * Requests user data
         */
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

        /**
         * Sets user as logged in
         * @param {string} username 
         */
        logIn(username) {

            this.username = username;
            this.isLoggedIn = true;
        },

        /**
         * Sets user as logged out
         */
        logOut() {

            this.username = null;
            this.isLoggedIn = false;
        }
    }
});