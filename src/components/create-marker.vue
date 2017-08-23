<template lang="html">
  <div class="">
    <button @click='takePicture()' big fill><i class="btn-icon">add_a_photo</i></button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      photoURL: ''
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
        let timeTaken = new Date().toLocaleString()
        const markerData = {
          userId: this.user.uid,
          image: imageURI.split('/').pop(),
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
