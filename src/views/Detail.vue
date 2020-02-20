<template>
 <v-slide-x-transition mode="out-in">
 <span>
   <v-row no-gutters>
      <v-col>
        <v-card class="pa-2" flat tile>
          <B>Transmis le</B>
        </v-card>
      </v-col>
       <v-col>
        <v-card class="pa-2" flat tile>
          {{handleDate(getItem.sentDate)}}
        </v-card>
      </v-col>
    </v-row>
    <v-row no-gutters v-if="getItem.position">
      <v-col>
        <v-card class="pa-2" flat tile>
          <b>Depuis</b>
        </v-card>
      </v-col>
       <v-col>
        <v-card class="pa-2" flat tile>
           {{(getItem || {}).address}}
        </v-card>
      </v-col>
    </v-row>
    <v-row no-gutters v-if="getItem.position">
      <v-col>
        <v-card class="pa-2" flat tile>
          <GmapMap
              :center="getItem.position || {lat:0, lng:0}"
              :zoom="15"
              map-type-id="roadmap"
              :style="{width: windowSize.x-18 + 'px', height: '200px'}"
               :options="{
                  zoomControl: false,
                  mapTypeControl: false,
                  scaleControl: false,
                  streetViewControl: false,
                  rotateControl: true,
                  fullscreenControl: true,
                  disableDefaultUi: false
                }"
          >
            <GmapMarker
                    :position="getItem.position || {lat:0, lng:0}"
                    :clickable="false"
                    :draggable="false"
            />
          </GmapMap>
        </v-card>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col>
        <v-card class="pa-2" color="grey white--text" flat tile>
          Formulaires envoyés
        </v-card>
      </v-col>
    </v-row>
  <v-list two-line>
    <v-list-item-group>
      <template v-for="(item, index) in getItem.documents">
        <v-list-item :key="item.id" :ripple="false" inactive>
          <template v-slot:default="">
            <v-list-item-content>
              <v-list-item-title>
              {{item.templateName}}
              </v-list-item-title>
              <v-list-item-subtitle
                class="text--primary"
                v-text="item.templateDescription"
              ></v-list-item-subtitle>
              <v-list-item-subtitle
                v-text="item.copyNumber"
              ></v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <div class="d-flex">
              <v-btn class="mr-3" x-large icon color="blue" @click="openPDF(item.pdfHWLink)">
                <v-icon x-large color="grey lighten-1">
                  mdi-file-pdf-outline
                </v-icon>
              </v-btn>
              <v-btn x-large icon color="blue" @click="openPDF(item.pdfOCRLink)">
                <v-icon x-large color="yellow">
                  mdi-file-pdf-outline
                </v-icon>
               </v-btn>
              </div>
            </v-list-item-action>
          </template>
        </v-list-item>
        <v-divider
          v-if="index + 1 < getItem.documents.length"
          :key="index"
        ></v-divider>
      </template>
    </v-list-item-group>
  </v-list>
   </span>
  </v-slide-x-transition>
</template>
<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
  name: 'Detail',
  props: ['pgcId'],
  watch: {
    pgcId: function () { this.getAddress() }
  },
  computed: {
    ...mapGetters(['getSentItem']),
    getItem () {
      const t = this.$store.getters.getSentItem(this.pgcId) || {}
      console.log(t)
      return (this.$store.getters.getSentItem(this.pgcId) || {})
    }
  },
  mounted () {
    this.onResize()
    this.getAddress()
    if (window.KPdfReader) {
      this.$data.pdfViewer = window.KPdfReader
    }
  },
  methods: {
    openPDF (link) {
      var _self = this
      // eslint-disable-next-line no-undef
      var fileTransfer = new FileTransfer()
      var uri = window.cordova.file.dataDirectory + 'tmppdf.pdf'

      fileTransfer.download(link, uri, entry => {
        entry.file(function (file) {
          var reader = new FileReader()
          reader.onloadend = function () {
            var base64 = this.result.substring(this.result.indexOf(',') + 1)
            _self.pdfViewer.fromBase64(
              base64, // the base 64 pdf
              {
                watermark: 'A nice watermark',
                fileName: 'Test file pdf' // the title of the pdf
              }
            )
              .then(() => {
                // pdf was closed
              })
              .catch(console.error)
          }

          reader.readAsDataURL(file)
        }, err => { console.log(err) })
      }, err => { alert('download error ' + JSON.stringify(err)) },
      false,
      {
        headers: {
          Authorization: 'Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA==',
          Connection: 'close'
        },
        chunkedMode: false
      })
    },
    handleDate (dt) {
      moment.locale('fr')
      return dt ? moment(dt).format('LLLL') : ''
    },
    onResize () {
      this.windowSize = { x: window.innerWidth, y: window.innerHeight }
    },
    getAddress: function () {
      const _self = this

      if ((!this.getItem.address || this.getItem.address === '') && this.getItem.position) {
        this.$geocoder.send(this.getItem.position, function (response) {
          if (response && response.results && response.results.length > 0) {
            _self.$store.commit('setAddress', { id: _self.pgcId, value: response.results[0].formatted_address })
          }
        })
      }
    }
  },
  data () {
    return {
      pdfViewer: undefined,
      item: [],
      address: '',
      windowSize: {
        x: 0,
        y: 0
      }
    }
  }
}
</script>
