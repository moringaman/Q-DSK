// === DEFAULT / CUSTOM STYLE ===
// WARNING! always comment out ONE of the two require() calls below.
// 1. use next line to activate CUSTOM STYLE (./src/themes)
// require(`./themes/app.${__THEME}.styl`)
// 2. or, use next line to activate DEFAULT QUASAR STYLE
require(`quasar/dist/quasar.${__THEME}.css`)
// ==============================

import Vue from 'vue'
import Quasar, { QBtn, QPopover, QIcon, QFixedPosition } from 'quasar'
import router from './router'
import { store } from './store'
import firebase from 'firebase'
import { config } from './helpers/firebaseConfig'
import * as VueGoogleMaps from 'vue2-google-maps'
import MapStyle from './helpers/mapstyle'
import moment from 'moment'

Vue.use(moment)

Vue.prototype.$mapstyle = MapStyle

Vue.filter('firstWord', function (value) {
  let firstWord = value.substr(0, value.indexOf(' '))
  return firstWord
})

Vue.filter('timeAgo', function (value) {
  let dateTime
  var datePart = value.slice(0, 10)
  var timePart = value.slice(11, 17)
  datePart = datePart.split('/').reverse().join('-')
  dateTime = datePart + timePart
  let timeVal = moment(dateTime).startOf('minute').fromNow()
  return timeVal
})

Vue.use(Quasar, {
  components: {
    QBtn,
    QPopover,
    QIcon,
    QFixedPosition
  }
}) // Install Quasar Framework

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDysON6Twe-naM9LG-5xQ7fMXaRd3rXgss',
    libraries: 'places, drawing, visualization' // This is required if you use the Autocomplete plugin
// OR: libraries: 'places,drawing'
// OR: libraries: 'places,drawing,visualization'
// (as you require)
  }
})

Quasar.start(() => {
  /* eslint-disable no-new */
  new Vue({
    router,
    created () {
      firebase.initializeApp(config)
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.$router.push('/')
          this.$store.dispatch('loadCurrentUser', user.uid)
          this.$store.commit('setUser', user)
          this.$store.commit('setLoggedIn', true)
        }
        else {
          this.$router.push('/signup')
          this.$store.commit('setLoggedIn', false)
          this.$store.dispatch('showMessage', {message: 'please login to post data', color: 'rgba(255,0,0, 0.6)', icon: 'error_outline'})
        }
      })
      this.$store.dispatch('getLocation')
    },
    el: '#q-app',
    store,
    render: h => h(require('./App'))
  })
})
