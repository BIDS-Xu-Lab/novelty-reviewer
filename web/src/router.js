import { createWebHistory, createRouter } from 'vue-router'

import HomePage from './pages/Home.vue';
import VisPage from './pages/Vis.vue';

const routes = [
    { path: '/', component: HomePage },
    { path: '/vis', component: VisPage },
]

const router = createRouter({
    history: createWebHistory(
        import.meta.env.VITE_BASE_PATH || './'
    ),
    routes,
})

export default router