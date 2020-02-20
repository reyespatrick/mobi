<template>
  <v-slide-x-transition mode="out-in">
      <v-form class="pa-4"
      ref="paramform"
      v-model="formValid"
      lazy-validation
    >
      <v-text-field
        v-model="userName"
        :rules="[rules.required]"
        label="Utilisateur"
        required
      ></v-text-field>

      <v-text-field
        v-model="password"
        :rules="[rules.required]"
        label="Mot de passe"
        required
      ></v-text-field>

      <v-text-field
        v-model="serverUrl"
        :rules="[rules.required]"
        label="Serveur"
        required
      ></v-text-field>

       <v-row align="center">
        <v-col class="text-center" cols="12">
          <v-btn class="ma-2" outlined color="blue" @click="saveChanges" :disabled="!enableSave">Enrégistrer</v-btn>
        </v-col>
      </v-row>
       <v-row align="center">
        <v-col class="text-center" cols="12">
          <v-btn class="ma-4" outlined color="red" @click="clearCache">Effacer les données locales</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-slide-x-transition>
</template>
<script>
export default {
  name: 'Settings',
  computed: {
    getUser () { return this.$store.getters.getUser },
    enableSave () {
      const ret = ((this.userName !== null && this.userName !== '') &&
      (this.password !== null && this.password !== '') &&
      (this.serverUrl !== null && this.serverUrl !== ''))

      return ret
    }
  },
  data () {
    return {
      rules: {
        required: value => !!value || 'Obligatoire'
      },
      userName: this.$store.getters.getUser.userName,
      password: this.$store.getters.getUser.password,
      serverUrl: this.$store.getters.getUser.serverUrl,
      formValid: false
    }
  },
  methods: {
    clearCache () {
      this.$store.dispatch('clearCache')
    },
    saveChanges () {
      // let _self = this

      this.$store.commit('setUserName', this.userName)
      this.$store.commit('setPassword', this.password)
      this.$store.commit('setServerUrl', this.serverUrl)

      this.$store.dispatch('connectService')
        .then(() => {
          this.$router.back()
        })
        .catch((e) => alert('could not find service plugin, please contact support.'))
    }
  }
}
</script>
