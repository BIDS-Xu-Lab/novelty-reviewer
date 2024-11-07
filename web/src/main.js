import "primeicons/primeicons.css";
import './main.css';

import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import App from './App.vue';
import { createPinia } from 'pinia';
import { useDataStore } from "./DataStore";
import ToastService from 'primevue/toastservice';

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
