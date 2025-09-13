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
					primary: '#166534',      // verde escuro (folha)
					secondary: '#65a30d',    // verde claro (musgo)
					accent: '#facc15',       // amarelo (luz filtrada)
					surface: '#334155',      // cinza azulado escuro (tronco/sombra)
					background: '#0f172a',   // quase preto (fundo floresta)
					error: '#dc2626',        // vermelho escuro
					info: '#38bdf8',         // azul claro
					success: '#22c55e',      // verde vibrante
					warning: '#f59e42',      // laranja suave
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
