import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    activity: 'aucune activité',
    pen: '',
    userName: '',
    password: '',
    serverUrl: '',
    items: [],
    lastInsertedItem: {}
  },
  getters: {
    getSettingAreOk: state => {
      return state.userName !== '' && state.password !== '' && state.serverUrl !== ''
    },
    getActivity: state => state.activity,
    getUser: state => ({ userName: state.userName, password: state.password, serverUrl: state.serverUrl }),
    getSentItems: state => {
      return state.items.sort(function (a, b) {
        return new Date(b.sentDate) - new Date(a.sentDate)
      })
    },
    getSentItem: state => id => {
      return state.items.find(item => item.id === id)
    },
    getLastSentItem: state => state.lastInsertedItem
  },
  mutations: {
    setPen: (state, pen) => {
      state.pen = pen
    },
    setActivity: (state, activity) => {
      state.activity = activity
    },
    setUserName: (state, userName = '') => {
      state.userName = userName
      window.localStorage.setItem('userName', userName)
    },
    setPassword: (state, password = '') => {
      state.password = password
      window.localStorage.setItem('userPassword', password)
    },
    setServerUrl: (state, serverUrl = '') => {
      if (serverUrl == null) {
        serverUrl = ''
      }

      if (serverUrl.indexOf('http') === -1 && serverUrl.indexOf('https') === -1) {
        state.serverUrl = 'http://' + serverUrl
      } else {
        state.serverUrl = serverUrl
      }

      window.localStorage.setItem('serverURL', serverUrl)

      console.log(serverUrl)
    },
    setAddress: (state, payload) => {
      const i = state.items.findIndex(item => item.id === payload.id)
      if (i >= 0) {
        Vue.set(state.items, i, { ...state.items[i], address: payload.value })
      }
    },
    removeUploadedItem: (state, id) => {
      const idx = state.items.findIndex(item => item.id === id)
      if (idx > -1) {
        state.items.splice(idx, 1)
      }
    },
    setItems: (state, items) => {
      state.items = items != null ? items : []
    },
    addItem: (state, payload) => {
      const documents = []
      const downloadURL = state.serverUrl + '/cloudapi/Service.svc/xml/rest/remote_log;trema2011123!-ssde/RenderHWPDF/?copy='
      ;(payload.pages || []).forEach(doc => {
        documents.push({
          id: doc.id,
          templateName: doc.templateName,
          templateDescription: '',
          copyNumber: doc.copyNumber,
          anotoNumber: doc.anotoPage,
          pdfHWLink: downloadURL + doc.id,
          pdfOCRLink: downloadURL.replace('HWPDF', 'DataPDF') + doc.id
        })
      })

      if (!state.items) state.items = []

      state.lastInsertedItem = { sentDate: payload.sentDate, position: payload.position, id: payload.id, sent: true, documents: documents }
      state.items.push(state.lastInsertedItem)
      try {
        window.localStorage.setItem('items', JSON.stringify(state.items))
      } catch {}
    }
  },
  actions: {
    connectService: ({ state }) => {
      return new Promise((resolve, reject) => {
        if (window.plugins && window.plugins.dpcPen) {
          window.plugins.dpcPen.disable(() => {
            var serverUrl = state.serverUrl + '/cloudapi/PenUpload.ashx'
            console.log('server url: ' + serverUrl)
            window.plugins.dpcPen.enable([serverUrl], resolve, reject)
          })
          // eslint-disable-next-line prefer-promise-reject-errors
        } else reject('unknown plugin')
      })
    },
    clearCache: ({ state }) => {
      try {
        window.localStorage.setItem('items', [])
        state.items = []
      } catch {}
    },
    removeUploadedItem: ({ commit, state }, id) => {
      commit('removeUploadedItem', id)
      try {
        window.localStorage.setItem('items', JSON.stringify(state.items))
      } catch {}
    },
    restoreItems: state => {
      state.commit('setItems', [])
    },
    restoreUser: state => {
      state.commit(
        'setUserName',
        window.localStorage.getItem('userName') === 'null' || window.localStorage.getItem('userName') === ''
          ? ''
          : window.localStorage.getItem('userName')
      )
      state.commit(
        'setPassword',
        window.localStorage.getItem('userPassword') === 'null' || window.localStorage.getItem('userPassword') === ''
          ? ''
          : window.localStorage.getItem('userPassword')
      )
      state.commit(
        'setServerUrl',
        window.localStorage.getItem('serverURL') === 'null' || window.localStorage.getItem('serverURL') === ''
          ? ''
          : window.localStorage.getItem('serverURL')
      )
    }
  },
  modules: {}
})
