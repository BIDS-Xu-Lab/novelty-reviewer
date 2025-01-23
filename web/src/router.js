import { createWebHistory, createRouter } from 'vue-router'

import HomePage from './pages/Home.vue';

const routes = [
    { path: '/', component: HomePage },
]

const router = createRouter({
    history: createWebHistory(
        import.meta.env.BASE_URL
    ),
    routes,
})

export default router