import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createVuetify } from 'vuetify';
import 'vuetify/styles'; // Vuetify stil dosyaları
import '@mdi/font/css/materialdesignicons.css'; // Material Design Icons

const vuetify = createVuetify();

// import vuetify from './plugins/vuetify'

// import store from './store'
// import appAxios from '@/utils/appAxios'

const app = createApp(App);
app.use(router);
app.use(vuetify);
app.mount('#app');
