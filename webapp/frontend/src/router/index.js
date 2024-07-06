
import { createRouter, createWebHistory, START_LOCATION } from "vue-router";
import { useSessionStore } from '@/stores/session';
import LogInView from "@/views/LogInView.vue";

const router = createRouter({

    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/login",
            name: "login",
            component: LogInView,
            meta: { isAuthRequired: false }
        },
        {
            path: "/signup",
            name: "signup",
            component: () => import("@/views/SignUpView.vue"),
            meta: { isAuthRequired: false }
        },
        {
            path: "/boards",
            name: "boards",
            component: () => import("@/views/BoardsView.vue"),
            meta: { isAuthRequired: true }
        },
        {
            path: "/firmwares",
            name: "firmwares",
            component: () => import("@/views/FirmwaresView.vue"),
            meta: { isAuthRequired: true }
        },
        {
            path: "/:pathMatch(.*)*",
            component: () => import("@/views/NotFoundView.vue"),
            meta: { isAuthRequired: false }
        }
    ]
});

router.beforeEach(async (to, from) => {

    if (from === START_LOCATION) {

        await useSessionStore().init();
    }

    const isLoggedIn = useSessionStore().isLoggedIn;
    const isAuthRequired = to.meta.isAuthRequired;

    if (isLoggedIn && (!isAuthRequired || to.path === "/")) {

        return { name: "boards" };
    }

    if (!isLoggedIn && (isAuthRequired || to.path === "/")) {

        return { name: "login" };
    }
});

export default router;
