import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'
import { Loading, Toast } from 'quasar'
// import Axios from 'axios'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    center: {lat: 54.0, lng: -1.6},
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
    loading: false,
    error: null
  },
  mutations: {
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
    }
  },
  actions: {
    createMarker ({commit}, payload) {
      // TODO take camera image location, UID, time/date, geo-loc and create marker entry in Firebase
      firebase.database().ref('markers').push(
        {
          dateTime: payload.dateTime,
          location: payload.location,
          imageURL: payload.imageURL,
          userId: payload.userId
        }
      )
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
              id: user.uid,
              email: payload.email,
              createdMarkers: []
            }
            commit('setUser', newUser)
            store.dispatch('showMessage', 'Welcome Back')
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            Loading.hide()
            commit('setError', error)
            store.dispatch('showMessage', error)
            // alert(error)
          }
        )
    },
    showMessage ({dispatch}, payload) {
      Toast.create({
        html: `<strong>${payload}</strong>`,
        icon: 'error_outline',
        timeout: 4000,
        color: '#fff',
        bgColor: 'rgba(255,0,1, 0.6)',
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
              store.dispatch('showMessage', 'Your account has been created')
            }).catch((error) => {
              store.dispatch('showMessage', error)
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
    }
  },
  getters: {
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
    }
  }
})
