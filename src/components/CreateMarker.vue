<template lang="html">
<div>
    <q-fab
      style="position:absolute;
      bottom: 50px;"
      classNames="red"
      icon="keyboard_arrow_right"
      direction="right">
        <q-small-fab
          class="blue"
          @click.native="showModal()"
          icon="collections">
        </q-small-fab>
        <q-small-fab
          class="green"
          @click.native="takePicture()"
          icon="add_a_photo">
        </q-small-fab>
    </q-fab>
    <!-- Modal for photo submission -->
     <q-modal ref="maximizedModal" class="maximized" :content-css="{padding: '20px'}">
       <div class="card">
  <div class="card-title bg-primary text-white" icon="mood">
    <i>mood</i>Dude, You're a Legend!
  </div>
  <div class="card-content card-force-top-padding">
    <p>Please give some more details about your sky picture before posting</p>
    <img :src="photoURL"/>
    <div class="floating-label">
  <textarea required class="full-width" v-model="photoDesc"></textarea>
  <label>Description</label>
</div>
<div class="floating-label">
<q-range v-model="number" :min="1" :max="10"></q-range>
<label>Chemtrail Count</label>
</div>
  </div>
</div>
      <button class="positive" @click="checkAuthStatus()">Post Image</button>
      <button class="tertiary" @click="$refs.maximizedModal.close()">Try Again</button>
    </q-modal>
    <!-- Modal for submission history -->
    <q-modal @open="loadMarkers()" ref="historyModal" class="maximized" position="bottom" :content-css="{padding: '20px', minHeight: '100vh'}">
      <div class="card">
 <div class="card-title bg-primary text-white" icon="mood">
   <i>history</i>Your Post History
   </div>


</div>
 <wx-usermarkers :markers="markers"></wx-usermarkers>
     <button class="tertiary" @click="$refs.historyModal.close()">Back</button>
   </q-modal>
  </div>
</template>

<script>
import FilePath from '../helpers/filepath.js'
import UserMarkers from './UserHistory.vue'
import * as firebase from 'firebase'
// import { Loading } from 'quasar'
export default {

  data () {
    return {
      photoURL: '',
      photo: '',
      path: '',
      photoDesc: '',
      usersMarkers: this.markers,
      number: 0,
      min: 1,
      max: 10
    }
  },
  components: {
    'wxUsermarkers': UserMarkers
  },
  props: {
    markers: Array
  },
  mixins: [FilePath],
  methods: {
    checkAuthStatus: function () {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.markerCreate()
        }
        else {
          this.$router.push('/signin')
          this.$store.dispatch('showMessage', {message: 'please login to post data', color: 'rgba(255,0,0, 0.6)', icon: 'error_outline'})
        }
      })
    },
    takePicture: function () {
      if (!navigator.camera) {
        window.alert('cordova.camera not found !')
        return
      }
      // TODO Check for geo-position before taking picture
      navigator.camera.getPicture((imageURI) => {
        this.photoURL = imageURI
        // window.alert(imageURI)
        this.photo = imageURI.split('/').pop()
        var filepath = imageURI.split('/').splice(2)
        filepath.pop()
        filepath = filepath.join('/')
        this.path = filepath + '/'
        this.$refs.maximizedModal.open()
      }, (message) => {
        window.alert('FAILED : ' + message)
      }, {
        quality: 90,
        targetWidth: 500,
        targetHeight: 500,
        destinationType: navigator.camera.DestinationType.FILE_URI
      })
    },
    markerCreate: function () {
      this.$refs.maximizedModal.close()
      // let options = {
      //   weekday: 'long',
      //   year: 'numeric',
      //   month: 'short',
      //   day: 'numeric',
      //   hour: '2-digit',
      //   minute: '2-digit'
      // }
      let timeTaken = new Date().toLocaleString() // .toLocaleDateString(options)
      const markerData = {
        userId: this.user.uid,
        image: this.photo,
        sender: this.currentUser.username,
        photoUrl: this.photoURL,
        photoDesc: this.photoDesc,
        dateTime: timeTaken,
        town: this.$store.getters.locationTown,
        country: this.$store.getters.locationCountry,
        location: {
          lat: this.$store.getters.location.lat,
          lng: this.$store.getters.location.lng
        }
      }
      // window.alert(JSON.stringify(markerData))
      this.$store.dispatch('createMarker', markerData)
    },
    showModal: function () {
      this.$refs.historyModal.open()
    },
    loadMarkers: function () {
      this.$store.dispatch('loadMarkers')
      // this.usersMarkers = this.usersMarkers.splice(0, this.usersMarkers.length / 2)
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    },
    markerId () {
      return this.$store.getters.markerId
    },
    currentUser () {
      return this.$store.getters.currentUser
    }
  }
}
</script>

<style lang="css" scoped>

img {
  width: 76vw;
  height: 35vh;
  border-radius: 5%;
  background-image: url(../assets/placeholder.png);
}

i {
  font-size: 2em;
  margin: -15px 10px;
}
</style>
