<template>
  <v-slide-x-transition mode="out-in">
     <UploadList :items = "getItems" @removeItem="removeItem"/>
  </v-slide-x-transition>
</template>
<script>

import UploadList from '@/components/UploadList.vue'
export default {
  name: 'Home',
  computed: {
    getItems () {
      return this.$store.getters.getSentItems
    }
  },
  components: { UploadList },
  data () {
    return {
      selected: [2]
    }
  },
  methods: {
    removeItem (id) {
      this.$store.dispatch('removeUploadedItem', id)
    }
  }
}
</script>
