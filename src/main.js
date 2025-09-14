import { createApp } from 'vue'
import axios from 'axios'
import './css/style.css'
import './css/custom.css'
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
		defaultTheme: 'customTheme',
		themes: {
			customTheme: {
				dark: false,
				colors: {
					primary: '#3d423c',    // verde-acinzentado escuro (cor de destaque principal)
					secondary: '#b2b39f',  // oliva claro e suave
					accent: '#f5f7bd',     // amarelo pálido (detalhes e destaques)
					surface: '#dedfc5',    // bege claro para superfícies
					background: '#c8c9b5', // cinza/bege médio para fundo
					error: '#a33a3a',      // vermelho terroso
					info: '#4f6d7a',       // azul esverdeado suave
					success: '#6b8f71',    // verde natural discreto
					warning: '#d4a373',    // marrom/laranja suave
				}
			},
			light: {
				dark: false,
				colors: {
					primary: '#1976D2',
					secondary: '#424242',
					background: '#FFFFFF',
				}
			},
			dark: {
				dark: true,
				colors: {
					primary: '#c39738',
					secondary: '#ffff96',
					background: '#361f00',
				}
			}
		}
	},
	icons: {
		defaultSet: 'mdi',
	},
})



// CONFIGURAÇÃO GLOBAL AXIOS
axios.defaults.baseURL= `${import.meta.env.VITE_BACKEND_URL}/api` 
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
