import "primeicons/primeicons.css";
import './style.css';

import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import App from './App.vue';
import { createPinia } from 'pinia';
import { useDataStore } from "./DataStore";
import { ai_helper } from "./utils/ai_helper";
import ToastService from 'primevue/toastservice';

window.ai_helper = ai_helper;

const pinia = createPinia()
const app = createApp(App);

app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});

app.use(pinia);
app.use(ToastService);

const store = useDataStore();
window.store = store;

app.mount('#app');
