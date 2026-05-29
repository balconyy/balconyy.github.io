import {createRouter, createWebHistory} from 'vue-router'

import Home from '../views/Home.vue'
import Movie from "@/views/Movie.vue";

const index = [
    {
        path: '/',
        name: 'home',
        component: Home,

    },
    {
        path: "/movie/:kp_id",
        name: "movie",
        component: Movie,
        props: true,
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
router.afterEach((to) => {
    window.gtag?.('event', 'page_view', {
        page_path: to.fullPath,
        page_location: window.location.href,
        page_title: document.title
    })
})

export default router