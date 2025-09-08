<template>
	
	<!-- NOVA TAREFA -->
	<v-row class="d-flex justify-center">
    <v-col>
      <task-new
        :user-data="userData"
        @call-refresh-task-list="refreshTaskList()"
      />
    </v-col>
  </v-row>

	<!-- LISTA DE TAREFAS -->
	<v-row class="d-flex justify-center">
    <v-col>
      <task-list
        ref="TaskList"
        :user-data="userData"
        @call-edit-modal="openEditModal($event)"
      />
    </v-col>
  </v-row>

	<v-row class="d-flex justify-center">
    <v-col
      cols="12"
      sm="11"
      md="10"
      lg="8"
      xl="6"
    >
      <task-edit-modal
        ref="TaskEditModal"
        class="w-100 w-sm-75 w-md-75 w-lg-50"
        :task-data="taskData"
        :user-data="userData"
        @call-refresh-task-list="refreshTaskList()"
      />
    </v-col>
  </v-row>

	<!-- <v-row class="mt-18">
		<v-col>
			<v-btn @click="getUserData">userCheck</v-btn>
		</v-col>
	</v-row> -->

	
</template>


<script>
import axios from 'axios'
import TaskNew from './TaskNew.vue'
import TaskList from './TaskList.vue'
import TaskEditModal from './TaskEditModal.vue'
import LoginForm from './Login.vue'

const backendUrl = import.meta.env.VITE_BACKEND_URL

export default {

	components: {
		TaskNew,
		TaskList,
		TaskEditModal,
		LoginForm
	},

	props: {
		userData: {
			type: Object,
			default: () => ({})
		},
	},

	data() {
		return {
			taskData: null,
		}
	},

	methods: {
		async getUserData() {
			try {
				const response = await axios.get(`${backendUrl}/api/auth/check`)
				console.log("userCheck: ", response.data)
				if (response.data.data) {
					this.userData = response.data.data
					this.userAutenticated = true
				}
			} catch (error) {
				console.error("Erro ao consultar autenticação de usuário: \n", error.response.data.message)
			}

		},

		refreshTaskList() {
			//console.log("ouviu e chamou refreshTaskList no componente Pai")
			this.$refs.TaskList.getList()
		},

		openEditModal(param) {
			this.taskData = param
			this.$refs.TaskEditModal.modalView = true
		},

	},

	mounted() {
		//console.log("componente montado..")
	}
}

</script>