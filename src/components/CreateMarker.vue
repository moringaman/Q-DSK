<template lang="html">
  <button class="teal fixed-bottom-right" style="bottom: 10px; right: 16px;">
        <i>add_a_photo</i>
        <q-popover ref="popover4">
          <div class="group" style="width: 200px; height: 50px; text-align: center;">
            <button class="primary clear" @click="takePicture(), $refs.popover4.close()">
              <i>add_a_photo</i>
            </button>
            <button class="primary clear" @click="photoUpload(), $refs.popver4.close()">
              <i>thumb_down</i>
            </button>
          </div>
        </q-popover>
      </button>
    <!-- <button id="takePicture" @click='takePicture()' big fill><i class="btn-icon">add_a_photo</i></button> -->
</template>

<script>

export default {

  data () {
    return {
      photoURL: '',
      photo: '',
      path: ''
    }
  },
  methods: {
    takePicture: function () {
      if (!navigator.camera) {
        window.alert('cordova.camera not found !')
        return
      }
      navigator.camera.getPicture((imageURI) => {
        // window.alert('Photo URI : ' + imageURI + '' + this.location.lat)
        this.photoURL = imageURI
        this.photo = imageURI.split('/').pop()
        this.path = imageURI.split('/').pop().join('/')
        console.log(this.photo + '' + this.path)
        let timeTaken = new Date().toLocaleString()
        const markerData = {
          userId: this.user.uid,
          image: this.photo,
          dateTime: timeTaken,
          location: {
            lat: this.$store.getters.location.lat,
            lng: this.$store.getters.location.lng
          }
        }
        // window.alert(JSON.stringify(markerData))
        this.$store.dispatch('createMarker', markerData)
      }, (message) => {
        window.alert('FAILED : ' + message)
      }, {
        quality: 50,
        destinationType: navigator.camera.DestinationType.FILE_URI
      })
    },
    photoUpload: function () {
      console.log(this.photo + '' + this.path)
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    }
  }
}
</script>

<style lang="css">
</style>
