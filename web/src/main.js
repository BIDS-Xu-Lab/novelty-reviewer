import "primeicons/primeicons.css";
import './main.css';

import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import App from './App.vue';
import { createPinia } from 'pinia';


const pinia = createPinia()
const app = createApp(App);

app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});

app.use(pinia);

app.mount('#app');
