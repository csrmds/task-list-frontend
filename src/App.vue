<template>
	<v-app>
		<nav-bar 
			:user-data="userData"
			@set-user-authentication="setUserAuthentication($event)">
		</nav-bar>

		<v-row class="mt-18 d-flex justify-center">
			<v-col cols="12" sm="11" md="10" lg="7" xl="6">
				<login-form 
					v-if="!userAuthenticated"
					@set-user-authentication="setUserAuthentication($event)"
					>
				</login-form>
				<home v-else :user-data="userData" ></home>
			</v-col>
		</v-row>
		
	</v-app>
</template>

<script>
import NavBar from './components/NavBar.vue'
import Home from './components/Home.vue'
import LoginForm from './components/Login.vue'
import axios from 'axios'


export default {
	name: 'task-list',
	components: {NavBar, Home, LoginForm},

	data() {
		return {
			taskData: null,
			userData: {
				type: Object,
				default: () => ({})
			},
			userAuthenticated: false,

		}
	},

	methods: {
		setUserAuthentication(param) {
			this.userData = param
			if (param) {
				//console.log("setUserAuthentication param IF true: ", param)
				this.userAuthenticated = true
			} else {
				//console.log("setUserAuthentication param IF False: ", param)
				this.userAuthenticated = false
			}
			
		},

		async checkUserAuth() {
			//console.log("checkUser /api/auth/check")
			try {
				const response= await axios.get(`/auth/check`)
				//console.log("checkUser response: ", response.data)
				this.setUserAuthentication(response.data.data)
				this.userAuthenticated= true
			} catch(err) {
				console.log('usuário nao autenticado: ', err?.response.data.message)
				this.userAuthenticated= false
				this.setUserAuthentication(null)
				localStorage.removeItem('auth_token')
			}
			//console.log('LocalStorage: ', localStorage.getItem('auth_token'))
			//console.log('this.dataUser: ', this.userData)
			
		},

	},

	mounted() {

		this.checkUserAuth()

		const params= new URLSearchParams(window.location.search)
		const googleLoginStatus= params.get('google_auth')
		const email= params.get('email')
		const name= params.get('name')
		const last_name= params.get('last_name')
		const avatar= params.get('avatar')
		const access_token= params.get('access_token')
		const message= params.get('message')

		if (googleLoginStatus === 'success') {
			// Buscar dados do usuário autenticado via API
			//this.$router.replace({ query: {} }) // Limpa a query da URL se usar Vue Router
			this.setUserAuthentication({email, name, last_name, avatar, access_token})
			localStorage.setItem('auth_token', access_token)
			this.checkUserAuth()
			this.userAutenticated = true
		} else if (googleLoginStatus === 'error') {
			// Exibir mensagem de erro
			alert(message || 'Erro ao autenticar com Google')
			this.$router.replace({ query: {} })
			this.userAutenticated = false
		}

		//console.log("localStorage token: ", localStorage.getItem('auth_token'))
		
	}

}

</script>

<style scoped></style>
