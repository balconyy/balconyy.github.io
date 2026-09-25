import {createRouter, createWebHistory, RouteLocationNormalized, RouteRecordRaw} from 'vue-router'

import Home from '../views/Home.vue'
import Movie from "@/views/Movie.vue";
import Admin from "@/views/Admin.vue";
import AdminLogin from "@/views/AdminLogin.vue";
import {adminAuthApi} from "@/data/api/adminAuth";
import Cinema from "@/views/Cinema.vue";
import Streamer from "@/views/Streamer.vue";

declare module 'vue-router' {
    interface RouteMeta {
        title?: string
        requiresAuth?: boolean
    }
}

const index: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: Home,
        meta: {
            title: 'Balcony - Фильмы и сериалы'
        }

    },
    {
        path: "/movie/:kpId",
        name: "movie",
        component: Movie,
        meta: {
            title: 'Balcony - {{kpId}}',
        },
        props: (route) => ({
            kpId: Number(route.params.kpId)
        })

    },
    {
        path: "/cinema",
        name: "cinema",
        component: Cinema,
    },
    {
        path: "/streamer/:nickname",
        name: "streamer",
        component: Streamer,
        props: (route) => ({
            nickname: String(route.params.nickname)
        })
    },
    {
        path: "/admin/login",
        name: "adminLogin",
        component: AdminLogin,
    },
    {
        path: "/admin",
        name: "admin",
        component: Admin,
        meta: {requiresAuth: true}
    }

]

const router = createRouter({
        history: createWebHistory(),
        routes: index,
        scrollBehavior() {
            return {top: 0}
        },
    },
)

router.beforeEach(async (to: RouteLocationNormalized) => {
    if (to.meta.requiresAuth) {
        try {
            await adminAuthApi.check()
        } catch (error) {
            return '/admin/login'
        }
    }
})

router.afterEach((to: RouteLocationNormalized) => {
    window.gtag?.('event', 'page_view', {
        page_path: to.fullPath,
        page_location: window.location.href,
        page_title: document.title
    })
})

export default router