<template>
	<v-app>
		<nav-bar 
			:user-data="userData"
			@set-user-authentication="setUserAuthentication($event)">
		</nav-bar>

		<v-row class="mt-18 d-flex justify-center">
			<v-col cols="12" sm="11" md="10" lg="8" xl="6">
				<login-form 
					v-if="!userAutenticated"
					@set-user-authentication="setUserAuthentication($event)"
					>
				</login-form>
				<home v-else :user-data="userData" ></home>
			</v-col>
		</v-row>

		<v-row>
			<v-col>
				<v-btn @click="checkUserData()">CheckUserData componente App</v-btn>
			</v-col>
		</v-row>

		
	</v-app>
</template>

<script>
import NavBar from './components/NavBar.vue'
import Home from './components/Home.vue'
import LoginForm from './components/Login.vue'


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
			userAutenticated: false,

		}
	},

	methods: {
		setUserAuthentication(param) {
			this.userData = param
			if (param) {
				console.log("setUserAuthentication param IF true: ", param)
				this.userAutenticated = true
			} else {
				console.log("setUserAuthentication param IF False: ", param)
				this.userAutenticated = false
			}
			
		},

		async checkUserAuth() {
			try {
				const response= await axios.get(`${this.backendUrl}/api/auth/check`)
				console.log("checkUser response: ", response.data)
				this.userAuthenticated= true
			} catch(err) {
				console.log('usuário nao autenticado: ', err.response?.data)
				this.userAuthenticated= false
				localStorage.removeItem('auth_token')
			}
			
		},

		checkUserData() {
			console.log("App.vue checkuserdata: ", this.userData)
			console.log("token localStorage: ", localStorage.getItem('auth_token'))
		}
	},

	mounted() {
		console.log("localStorage token: ", localStorage.getItem('auth_token'))
		//this.checkUserAuth()
	}

}

</script>

<style scoped></style>
