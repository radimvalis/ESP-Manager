
import { createRouter, createWebHistory, START_LOCATION } from "vue-router";
import { useSessionStore } from '@/stores/session';
import LogInView from "@/views/LogInView.vue";

const router = createRouter({

    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/login",
            name: "LogIn",
            component: LogInView,
            meta: { isAuthRequired: false }
        },
        {
            path: "/signup",
            name: "SignUp",
            component: () => import("@/views/SignUpView.vue"),
            meta: { isAuthRequired: false }
        },
        {
            path: "/boards",
            name: "Boards",
            component: () => import("@/views/BoardsView.vue"),
            meta: { isAuthRequired: true }
        },
        {
            path: "/boards/new",
            name: "NewBoard",
            component: () => import("@/views/NewBoardView.vue"),
            meta: { isAuthRequired: true }
        },
        {
            path: "/boards/detail/:id",
            name: "BoardDetail",
            component: () => import("@/views/BoardDetailView.vue"),
            meta: { isAuthRequired: true }
        },
        {
            path: "/firmwares",
            name: "Firmwares",
            component: () => import("@/views/FirmwaresView.vue"),
            meta: { isAuthRequired: true }
        },
        {
            path: "/firmwares/new",
            name: "NewFirmware",
            component: () => import("@/views/NewFirmwareView.vue"),
            meta: { isAuthRequired: true }
        },
        {
            path: "/firmwares/detail/:id",
            name: "FirmwareDetail",
            component: () => import("@/views/FirmwareDetailView.vue"),
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

        return { name: "Boards" };
    }

    if (!isLoggedIn && (isAuthRequired || to.path === "/")) {

        return { name: "LogIn" };
    }
});

export default router;
