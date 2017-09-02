import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'
import { Loading, Toast } from 'quasar'
// import Randomstring from 'randomstring'
import MyUid from '../helpers/uid.js'
// import Axios from 'axios'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    center: {lat: 54.0, lng: -1.6},
    location: '',
    loadedMarkers: [
      {
        sender: 'John Smith',
        userId: 'iuyrewiudhiwedhwe',
        timestamp: '12:00:00',
        position: {lat: 53.5, lng: -1.34}
      },
      {
        sender: 'Andre Jones',
        userId: 'dscbdshwidbioiaq',
        timestamp: '12:00:00',
        position: {lat: 51.5, lng: -1.04}
      },
      {
        sender: 'Peter Davis',
        userId: 'duhhwiw9chbcosw0jk',
        timestamp: '12:00:00',
        position: {lat: 50.5, lng: -1.36}
      },
      {
        sender: 'Susan Phillips ',
        userId: '43bjhfsd9h8fbskqwa',
        timestamp: '12:00:00',
        position: {lat: 51.2, lng: -1.24}
      }
    ],
    user: null,
    avatar: null,
    markerId: null,
    loading: false,
    error: null,
    loggedIn: false
  },
  mutations: {
    setLocation (state, payload) {
      state.location = payload
    },
    createMarker (state, payload) {
      state.loadedMarkers.push()
    },
    setUser (state, payload) {
      state.user = payload
    },
    setAvatar (state, payload) {
      state.avatar = payload
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    clearError (state) {
      state.error = null
    },
    setLoggedIn (state, payload) {
      state.loggedIn = payload
    },
    setMarkerId (state, payload) {
      state.markerId = payload
    }
  },
  actions: {
    getLocation ({commit}, payload) {
      if (!navigator.geolocation) {
        window.alert('No geo-location')
      }
      navigator.geolocation.getCurrentPosition((position) => {
         // window.alert('{lat: ' + position.coords.latitude + ', lng: ' + position.coords.longitude + '}')
        let location = {lat: position.coords.latitude, lng: position.coords.longitude}
        commit('setLocation', location)
      }, (error) => {
        window.alert('FAILED Error #' + error.code + ' ' + error.message)
      }, {
        timeout: 3000,
        enableHighAccuracy: true
      })
    },
    createMarker ({commit}, payload) {
      // window.alert(JSON.stringify(payload))
      Loading.show(
        {
          message: 'Posting Data'
        }
      )
      // let markerId = Randomstring.generate()
      let markerId = MyUid()
      firebase.database().ref('markers/' + markerId).set(payload)
      .then((data) => {
        commit('createMarker', payload)
        commit('setMarkerId', markerId)
        store.dispatch('photoUpload', payload.photoUrl)
        Loading.hide()
        store.dispatch('showMessage', {message: 'Marker Created', color: 'rgba(0,128,0, 0.6)'})
      })
      .catch((error) => {
        Loading.hide()
        store.dispatch('showMessage', {message: error, color: 'rgba(255,0,0, 0.6)'})
      })
    },
    loadMarkers ({commit}, payload) {
      // TODO query firebase for markers and push to state markers object
    },
    photoUpload ({dispatch}, payload) {
      var img = new Image()
      var c = document.createElement('canvas')
      var ctx = c.getContext('2d')
      let storage = firebase.storage()
      let storageRef = storage.ref()
      let filesRef = storageRef.child('markers/' + store.markerId + '.jpg')
      // window.alert(img.src)
      img.onload = function () {
        c.width = this.naturalWidth     // update canvas size to match image
        c.height = this.naturalHeight
        ctx.drawImage(this, 0, 0)
        var dataURL = c.toDataURL('image/jpeg', 0.75)
        Loading.show(
          {
            message: 'Posting Photo'
          }
        )
        filesRef.putString(dataURL, 'data_url')
        .then((snapshot) => {
          window.alert('Uploaded a blob or file!')
          var downloadURL = snapshot.downloadURL
          window.alert(downloadURL)
        }).catch((error) => {
          window.alert(error)
        })
      }
      img.crossOrigin = ''             // if from different origin
      img.src = payload.photoUrl
    },
    signUserIn ({commit}, payload) {
      Loading.show(
        {
          message: 'Authenticating'
        }
      )
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            Loading.hide()
            commit('setLoading', false)
            const newUser = {
              uid: user.uid,
              email: payload.email,
              createdMarkers: []
            }
            commit('setUser', newUser)
            commit('setLoggedIn', true)
            store.dispatch('showMessage', {message: 'Welcome Back', color: 'rgba(0,128,0, 0.6)'})
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            Loading.hide()
            commit('setError', error)
            store.dispatch('showMessage', {message: error, color: 'rgba(255,0,0, 0.6)'})
            // alert(error)
          }
        )
    },
    showMessage ({dispatch}, payload) {
      Toast.create({
        html: `<strong>${payload.message}</strong>`,
        icon: 'error_outline',
        timeout: 4000,
        color: '#fff',
        bgColor: payload.color,
        button: {
          label: '',
          handler () {
          // Specify what to do when button is clicked/tapped
          },
          color: '#000'
        }
      })
    },
    // async getAvatar ({dispatch}, payload) {
      // TODO Use axios to fetch avatar data
      // const URL = `http://www.avatarapi.com/avatar.asmx/GetProfile?email=${payload}`
      // const CRED = `&username=webnostix&password=Malachi01`
      // const response = await Axios.get(URL + CRED)
      // return response.json()
    // },
    createUserProfile (payload) {
      return new Promise((resolve, reject) => {
        firebase.database()
        .ref('users/' + payload.userId).set(
          {
            email: payload.email
          }
        ).then(response => {
          resolve(response)
        }, error => {
          reject(error)
        })
      })
    },
    signUserUp ({commit}, payload) {
      Loading.show(
        {
          message: 'Creating Account'
        }
      )
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            Loading.hide()
            commit('setLoading', false)
            const newUser = {
              id: user.uid,
              createdMarkers: []
            }
            // Add user profile to database
            firebase.database()
            .ref('users/' + newUser.id).set(
              {
                email: payload.email
              }
            ).then((user) => {
              commit('loggedIn', true)
              store.dispatch('showMessage', {message: 'Account Created', color: 'rgba(0,128,0, 0.6)'})
            }).catch((error) => {
              store.dispatch('showMessage', {message: error, color: 'rgba(255,0,0, 0.6)'})
            })
          }
        )
        .catch(
          error => {
            Loading.hide()
            commit('setLoading', false)
            commit('setError', error)
            store.dispatch('showMessage', error)
            console.log(error)
          }
        )
    },
    signOut ({commit}) {
      firebase.auth().signOut()
      commit('setUser', null)
      commit('loggedIn', false)
    }
  },
  getters: {
    location (state) {
      return state.location
    },
    loadedMarkers (state) {
      return state.loadedMarkers
    },
    user (state) {
      return state.user
    },
    loading (state) {
      return state.loading
    },
    avatar (state) {
      return state.avatar
    },
    signedIn (state) {
      return state.loggedIn
    },
    markerId (state) {
      return state.markerId
    }
  }
})
