import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/styles.css'
import axios from '@/utils/axios'

const app = createApp(App)

// Configurar axios como propiedad global
app.config.globalProperties.$axios = axios

app.use(router)
app.mount('#app')
