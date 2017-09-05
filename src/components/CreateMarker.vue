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
  </div>
</div>
      <button class="positive" @click="markerCreate()">Post Image</button>
      <button class="tertiary" @click="$refs.maximizedModal.close()">Try Again</button>
    </q-modal>
  </div>
</template>

<script>
import FilePath from '../helpers/filepath.js'
// import * as firebase from 'firebase'
// import { Loading } from 'quasar'
export default {

  data () {
    return {
      photoURL: '',
      photo: '',
      path: '',
      photoDesc: ''
    }
  },
  mixins: [FilePath],
  methods: {
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
      let timeTaken = new Date().toLocaleString()
      const markerData = {
        userId: this.user.uid,
        image: this.photo,
        photoUrl: this.photoURL,
        photoDesc: this.photoDesc,
        dateTime: timeTaken,
        location: {
          lat: this.$store.getters.location.lat,
          lng: this.$store.getters.location.lng
        }
      }
      // window.alert(JSON.stringify(markerData))
      this.$store.dispatch('createMarker', markerData)
    },
    showModal: function () {
      this.$refs.maximizedModal.open()
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    },
    markerId () {
      return this.$store.getters.markerId
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
  margin: -15px 2px;
}
</style>
