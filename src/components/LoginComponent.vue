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
					<v-col cols="12" class="d-flex justify-center">
						<v-btn width="100%" max-width="200px" height="40" variant="tonal" @click="submitLogin()">
							Login
						</v-btn>
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

		getGoogleLogin() {
			window.location.href = `${this.backendUrl}/auth/google`
		},

		callSetUserAuthentication(param) {
			this.$emit('setUserAuthentication', param)
		}
	}
}


</script>