<template>
	<v-app-bar>
		<v-app-bar-title>Task List</v-app-bar-title>

		<v-btn v-if="userData?.email" icon class="mr-6">
			<v-avatar :image="userData.avatar" size="48" />
			<v-menu activator="parent">
				<v-list>
					<v-list-item @click="callLogout()">
						<v-list-item-title>Logout</v-list-item-title>
					</v-list-item>
				</v-list>
			</v-menu>
		</v-btn>
		
		<v-btn v-else href="/login" class="mr-6">
			Login
		</v-btn>

	</v-app-bar>
</template>


<script>
import axios from 'axios'

export default {
	name: "NavBar",
	props: {
		userData: {
			type: Object,
			default: () => ({})
		}
	},

	data() {
		return {
			backendUrl: import.meta.env.VITE_BACKEND_URL,
			userAuthenticated: false
		}
	},

	methods: {

		async callLogout() {
			try {
				const response= await axios.get(`${this.backendUrl}/api/auth/logout`)
				if (response.data.success) {
					this.userAuthenticated= false
					localStorage.removeItem('auth_token')
					this.callSetUserAuthentication(null)
				}

			} catch(err) {
				console.error("Falha ao realizar logoff: ", err.response.data)
				this.userAuthenticated= false
				localStorage.removeItem('auth_token')
				this.callSetUserAuthentication(null)
			}
		},

		callSetUserAuthentication(param) {
			//console.log("call user atutenticated")
			this.$emit('setUserAuthentication', param)
		}

	},
	
	watch: {
		userData: {
			handler(newVal) {
				//console.log("identificou mudança: ", newVal)
				if (newVal?.email) this.userAuthenticated= true
			},
			deep: true
		}
	}

}

</script>