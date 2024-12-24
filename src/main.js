import { createApp } from 'vue'
import ArcoVue from '@arco-design/web-vue';
import App from './App.vue';
import axios from 'axios';
import store from './store';
import '@arco-design/web-vue/dist/arco.css';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';

const app = createApp(App);
app.config.globalProperties.$axios = axios
app.use(ArcoVue);
app.use(store);
app.use(ArcoVueIcon);
app.mount('#app');