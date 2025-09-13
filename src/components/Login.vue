<template>
	<v-card title="Login">
		<v-form ref="formRef" v-model="formIsValid">
			<v-card-item>
				<v-row>
					<v-col cols="12">
						<v-select 
							label="Email"
							variant="underlined"
							v-model="form.email" 
							:items="['celia@email.com', 'marcos@email.com']"
							:error="!!errors.email"
							:error-messages="errors.email">
						</v-select>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="12">
						<v-text-field v-model="form.password" label="Senha" variant="underlined"
							:type="passwordText ? 'text' : 'password'" :error="!!errors.password"
							:error-messages="errors.password" :append-icon="passwordText ? 'mdi-eye' : 'mdi-eye-off'"
							@click:append="passwordText = !passwordText" />
					</v-col>
				</v-row>
			</v-card-item>


			<v-card-actions class="mt-6">
				<v-row>
					<v-col cols="6" class="d-flex justify-center">
						<v-btn width="100%" max-width="200px" height="40" variant="tonal" @click="submitLogin()">
							Login
						</v-btn>
					</v-col>

					<v-col cols="6" class="d-flex justify-center">
						<button class="gsi-material-button" type="button">
							<div class="gsi-material-button-state" />
							<div class="gsi-material-button-content-wrapper" @click="getGoogleLogin()">
								<div class="gsi-material-button-icon">
									<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"
										xmlns:xlink="http://www.w3.org/1999/xlink" style="display: block;">
										<path fill="#EA4335"
											d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
										<path fill="#4285F4"
											d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
										<path fill="#FBBC05"
											d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
										<path fill="#34A853"
											d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
										<path fill="none" d="M0 0h48v48H0z" />
									</svg>
								</div>

								<span class="gsi-material-button-contents" style="color: black">Continuar com Google</span>
								<span style="display: none;">Continuar com Google</span>
							</div>
						</button>
					</v-col>
				</v-row>
			</v-card-actions>

			<v-card-item>
				<v-row>
					<v-col v-if="loaderView" cols="12" class="d-flex justify-center">
						<v-progress-circular color="green" indeterminate />
					</v-col>
					<v-col v-if="alertErrorView" cols="12">
						<v-alert :text="alertErrorMessage" type="error" variant="tonal" />
					</v-col>
				</v-row>
			</v-card-item>

			<v-card-item>
				<v-row>
					<v-col>
						<v-btn @click="teste()">Teste</v-btn>
					</v-col>
				</v-row>
			</v-card-item>
		</v-form>
	</v-card>
</template>

<script>
import axios from 'axios'
import * as yup from 'yup'

export default {
	data() {
		return {
			backendUrl: import.meta.env.VITE_BACKEND_URL,
			formRef: `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
			formIsValid: false,
			passwordText: false,
			alertErrorView: false,
			alertErrorMessage: '',
			loaderView: false,
			form: {
				email: 'celia@email.com',
				password: ''
			},
			errors: {
				email: '',
				password: ''
			},
			schema: yup.object({
				email: yup.string().required('Email é obrigatório').email('Endereço inválido'),
				password: yup.string().required('Senha obrigatória').min(4, 'Mínimo de 4 caracteres')
			})
		}
	},
	methods: {
		async submitLogin() {
			this.errors.email = ''
			this.errors.password = ''
			this.alertErrorView = false

			try {
				await this.schema.validate(this.form, { abortEarly: false })
				this.loaderView = true
				const response = await axios.post(`${this.backendUrl}/api/auth/login`, {
					password: this.form.password,
					email: this.form.email
				})
				
				if (response.data.success) {
					localStorage.setItem('auth_token', response.data.token)
					this.loaderView = false
					this.callSetUserAuthentication(response.data.data)
				} else {
					this.callSetUserAuthentication(null)
					this.loaderView = false
					this.alertErrorView = true
					this.alertErrorMessage = response.data.message
				}

			} catch (err) {
				this.loaderView = false
				if (err.inner) {
					err.inner.forEach(e => {
						this.errors[e.path] = e.message
					})
				} else {
					this.alertErrorMessage = err.message
					this.alertErrorView = true
					console.error('Erro ao fazer login: ', err.message)
				}
			}
		},

		async teste() {
			const response= await axios.get(`${this.backendUrl}/xc`)

			console.log("URL: ", `${this.backendUrl}/xc`)
			console.log("Response: ", response)
		},

		getGoogleLogin() {
			window.location.href = `${this.backendUrl}/auth/google`
		},

		callSetUserAuthentication(param) {
			//console.log("call user atutenticated")
			this.$emit('setUserAuthentication', param)
		}
	}
}


</script>