<template>
  <v-app>
    <v-app-bar app fixed>
      <v-btn v-if="$route.path !== '/'" icon @click.prevent="$router.back()">
        <v-icon large color="blue darken-2">mdi-arrow-left</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn icon v-if="isMainScreen" @click="add">
        <v-icon large color="blue darken-2">mdi-plus</v-icon>
      </v-btn>
      <v-btn icon v-if="isMainScreen" @click.prevent="$router.push({ name: 'settings' })">
        <v-icon large color="blue darken-2">mdi-settings</v-icon>
      </v-btn>
    </v-app-bar>
    <v-layout column align-center>
      <v-container fluid>
        <v-content>
          <transition name="fade">
            <router-view></router-view>
          </transition>
        </v-content>
      </v-container>
    </v-layout>
    <v-footer :fixed="true" app>
      <v-row>
        <v-col class="text-center" cols="12">
          <B>{{ getActivity }}</B>
        </v-col>
        <v-col class="text-center pa-0" cols="12">
          <span>&copy; DPC Solutions 2020 - v2.0</span>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
// import Alert from '@/components/Alert.vue'
export default {
  // components: { Alert },
  data () {
    return {
      dismissible: false,
      foundPairedPen: false,
      transferOn: true,
      alertMessage: '',
      showAlert: false,
      progress: true,
      title: 'DIM.Router'
    }
  },
  created () {
    this.$store.dispatch('restoreUser')
    this.$store.dispatch('restoreItems')
  },
  computed: {
    isMainScreen () {
      var ret = this.$route.path === '/'
      return ret
    },
    getActivity () {
      return this.$store.getters.getActivity
    }
  },
  mounted () {
  },
  methods: {
    add () {
      const data = {
        sentDate: Date.now(),
        id: Date.now(),
        sent: true,
        documents: [
          {
            id: Date.now(),
            templateName: "Orllati Rapport d'Heures v10",
            templateDescription: '',
            copyNumber: '152224',
            anotoNumber: '',
            pdfHWLink: 'http://sources.digitalpencorp.ch',
            pdfOCRLink: 'http://sources.digitalpencorp.ch'
          }
        ]
      }
      this.$store.commit('addItem', data)
    }
  }
}
</script>
