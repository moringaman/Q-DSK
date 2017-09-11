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
        location: {lat: 53.5, lng: -1.34}
      },
      {
        sender: 'Andre Jones',
        userId: 'dscbdshwidbioiaq',
        timestamp: '12:00:00',
        location: {lat: 51.5, lng: -1.04}
      },
      {
        sender: 'Peter Davis',
        userId: 'duhhwiw9chbcosw0jk',
        timestamp: '12:00:00',
        location: {lat: 50.5, lng: -1.36}
      },
      {
        sender: 'Susan Phillips ',
        userId: '43bjhfsd9h8fbskqwa',
        timestamp: '12:00:00',
        location: {lat: 51.2, lng: -1.24}
      }
    ],
    currentUser: [],
    user: [],
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
      state.loadedMarkers.push(...payload)
    },
    addDownloadURL (state, payload) {
      state.loadedMarkers.slice(-1).push(payload)
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
    },
    setCurrentUser (state, payload) {
      state.currentUser = payload
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
        // TODO get city with avios.get(`http://maps.googleapis.com/maps/api/geocode/json?latlng=53.42308026896434,-1.353393416106956&sensor=true)
        commit('setLocation', location)
      }, (error) => {
        store.dispatch('showMessage', {message: error.message, color: 'rgba(255,0,0, 0.6)', icon: 'error_outline'})
      }, {
        timeout: 3000,
        enableHighAccuracy: true
      })
    },
    createMarker ({commit}, payload) {
      // window.alert(JSON.stringify(payload))
      let markerId = MyUid()
      let mData = {
        userId: payload.userId,
        image: markerId + '.jpg',
        sender: payload.sender,
        photoUrl: payload.photoUrl,
        photoDesc: payload.photoDesc,
        dateTime: payload.dateTime,
        location: {
          lat: payload.location.lat,
          lng: payload.location.lng
        }
      }
      // window.alert(JSON.stringify(mData))
      Loading.show(
        {
          message: 'Posting Data'
        }
      )
      firebase.database().ref('markers/' + markerId).set(mData)
      .then((data) => {
        commit('createMarker', payload)
        commit('setMarkerId', markerId)
        store.dispatch('photoUpload', {photoUrl: payload.photoUrl, uid: markerId})
      })
      .catch((error) => {
        Loading.hide()
        store.dispatch('showMessage', {message: error, color: 'rgba(255,0,0, 0.6)', icon: 'error_outline'})
      })
    },
    loadMarkers ({commit}, payload) {
      // TODO query firebase for markers and push to state markers object
      const db = firebase.database()
      const ref = db.ref('markers')
      ref.orderByKey().limitToFirst(1)
      ref.on('value', snap => {
        let keys = []
        // console.log(snap.val())
        snap.forEach(function (item) {
          var itemVal = item.val()
          keys.push(itemVal)
        })
        console.log(keys)
        commit('createMarker', keys)
      })
    },
    photoUpload ({dispatch}, payload) {
      // var id = store.markerId
      var img = new Image()
      var c = document.createElement('canvas')
      var ctx = c.getContext('2d')
      let storage = firebase.storage()
      let storageRef = storage.ref()
      let filesRef = storageRef.child('markers/' + payload.uid + '.jpg')
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
          Loading.hide()
          store.dispatch('showMessage', {message: 'Marker Created', color: 'rgba(0,128,0, 0.6)', icon: 'done'})
          // window.alert('Uploaded a blob or file!')
          var downloadURL = snapshot.downloadURL
          // TODO Push download URL onto last marker array element
          // var myObj = this.$store.state.loadedMarkers.slice(-1)
          // myObj.downloadURL = downloadURL
          store.commit('addDownloadURL', downloadURL)
          firebase.database().ref().child('/markers/' + payload.uid)
          .update({downloadURL: downloadURL})
          // window.alert(downloadURL) ** USEFUL FOR USING IMAGE IN FUTURE
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
            // store.dispatch('showMessage', {message: 'Welcome Back', color: 'rgba(0,128,0, 0.6)', icon: 'done'})
            store.dispatch('loadCurrentUser', user.uid)
          }
        )
        .catch(
          error => {
            commit('setLoggedIn', false)
            Loading.hide()
            commit('setError', error)
            store.dispatch('showMessage', {message: error, color: 'rgba(255,0,0, 0.6)', icon: 'error_outline'})
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
                email: payload.email,
                username: payload.username
              }
            ).then((user) => {
              commit('setLoggedIn', true)
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
    loadCurrentUser ({dispatch}, payload) {
      // let vm = this
      var db = firebase.database()
      var ref = db.ref('users')
      ref.orderByKey().equalTo(payload).limitToFirst(10)
      .on('value', snap => {
        console.log(snap.val()[payload])
        store.commit('setCurrentUser', snap.val()[payload])
      })
    },
    signOut ({commit}) {
      firebase.auth().signOut()
      commit('setUser', null)
      commit('setLoggedIn', false)
      commit('setCurrentUser', null)
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
    },
    currentUser (state) {
      return state.currentUser
    },
    lastMarker (state) {
      return state.loadedMarkers.slice(-1)
    },
    userMarkers (state) {
      var arr = state.loadedMarkers
      var userArr = []
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].userId === state.user.uid) {
          userArr.push(arr[i])
        }
      }
      return userArr
    }
  }
})
