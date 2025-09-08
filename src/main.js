import { createApp } from 'vue'
import axios from 'axios'
import './css/style.css'
import './css/custom.css'
import './css/tailwind-bg-colors.css'
import App from './App.vue'


// Vue the mask
import VueTheMask from 'vue-the-mask'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

// Vuetify configuration
const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'dark',
    },
    icons: {
        defaultSet: 'mdi',
    },
})


// CSRF Token configuration
// const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
// if (token) {
//     axios.defaults.headers.common['X-CSRF-TOKEN'] = token
//     window.csrfToken = token
// } else {
//     console.error('CSRF token não encontrado!')
// }

// CONFIGURAÇÃO GLOBAL AXIOS
axios.defaults.baseURL= 'http://localhost:8000/api'
axios.interceptors.request.use(config=> {
    const token= localStorage.getItem('auth_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    } else {
        delete config.headers.Authorization
    }
    return config
})
// const token= localStorage.getItem('auth_token')
// if (token) {
//     axios.defaults.headers.common['Authorization']= `Bearer ${token}`
// }

// COMPONENTES


const app = createApp(App)
app.use(vuetify)
app.use(VueTheMask)


app.mount("#app")
