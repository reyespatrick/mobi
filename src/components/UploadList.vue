<template>
  <!-- <v-slide-y-transition mode="out-in"> -->
  <!--   <v-layout column align-center> -->
  <ul id="listUploadId">
    <li v-for="item in items" :key="item.id" data-icon="thumbs-up" :class="{ 'blink received': blink && item.id === newItemId }">
      <div class="pb-2"><b>Formulaire(s) traité(s)</b></div>
      <div>
        <span class="font-weight-light">{{ handleDate(item.sentDate) }}</span>
      </div>
    </li>
  </ul>
  <!-- </v-layout>-->
  <!-- </v-slide-y-transition> -->
</template>
<script>
import mobiscroll from '@mobiscroll/javascript'
import '@mobiscroll/javascript/dist/css/mobiscroll.min.css'
import moment from 'moment'

export default {
  name: 'updateList',
  props: ['items'],
  computed: {},
  watch: {
    items (newVal, oldVal) {
      // setTimeout(() => this.initListview())
      const _self = this
      this.newItemId = newVal && Array.isArray(newVal) && newVal.length > 0 ? newVal[0].id : undefined
      setTimeout(() => {
        _self.initListview()
        _self.blink = true
        setTimeout(() => {
          _self.blink = false
        }, 4000)
      })
    }
  },
  methods: {
    getClass (id) {
      return this.blink && this.newItemId === id ? 'received blink' : ''
    },
    initListview: function () {
      const _self = this
      mobiscroll.listview('#listUploadId', {
        theme: 'ios',
        enhance: true,
        select: 'single',
        fixedHeader: true,
        themeVariant: 'light',
        onItemTap: function (event, inst) {
          _self.clicked(event.index)
        },
        stages: [
          {
            percent: 2,
            color: 'red',
            text: 'Effacer',
            action: function (event, inst) {
              _self.$emit('removeItem', this.internalItems[event.index].id)
            }
          }
        ]
      })
    },
    handleDate (dt) {
      moment.locale('fr')
      return dt ? moment(dt).format('LLLL') : ''
    },
    clicked (index) {
      this.$router.push('/detail/' + this.items[index].id)
    }
  },
  data () {
    return {
      blink: false,
      newItemId: undefined
    }
  },
  mounted () {
    this.initListview()
  }
}
</script>
<style>
.mbsc-lv-cont {
  width: 100%;
}

.received {
  background-color: #d6f0cc !important;
  display: block;
}

@keyframes fade {
  from {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
  to {
    opacity: 1;
  }
}

@-webkit-keyframes fade {
  from {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
  to {
    opacity: 1;
  }
}

.blink {
  animation: fade 3000ms infinite;
  -webkit-animation: fade 3000ms infinite;
}
</style>
