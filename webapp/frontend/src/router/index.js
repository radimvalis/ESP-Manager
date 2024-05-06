
import { createRouter, createWebHistory } from "vue-router";
import LogInView from "@/views/LogInView.vue";

const router = createRouter({

    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'login',
            component: LogInView
        },

        {
            path: "/signup",
            name: "signup",
            component: () => import("@/views/SignUpView.vue")
        }
    ]
});

export default router;
