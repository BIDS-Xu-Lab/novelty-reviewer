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
import { theme } from './theme';
import { definePreset } from '@primevue/themes';

import router from './router';

window.ai_helper = ai_helper;

const pinia = createPinia()
const app = createApp(App);

// add PrimeVue to the app
const my_theme = definePreset(Aura, theme);

app.use(PrimeVue, {
    theme: {
        preset: my_theme,
        options: {
        }
    }
});
app.use(pinia);
app.use(ToastService);

const store = useDataStore();
window.store = store;
store.loadSettingsFromLocalStorage();

// add the router to the app
app.use(router);

// bind router with store for navigation
router.beforeEach((to, from, next) => {
    // console.log('from', from, 'to', to);

    // set the store.current_page
    store.current_page = to.path.substring(1);
    next()
})

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

/* add icons to the library */
library.add(fas, far, fab)
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app');
