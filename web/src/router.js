import { createWebHistory, createRouter } from 'vue-router'

import HomePage from './pages/Home.vue';

const routes = [
    { path: '/', component: HomePage },
]

const router = createRouter({
    history: createWebHistory(
        import.meta.env.VITE_BASE_PATH || './'
    ),
    routes,
})

export default router