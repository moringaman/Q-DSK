<template lang="html">
    <q-fixed-position name="newmenu" corner="bottom-right" :offset="[16, 16]">
          <q-btn color="tertiary">
            <q-icon name="plus_one" />
            <q-popover ref="popover4">
            <div class="group" style="width: 220px; text-align: center;">
                <q-btn flat color="primary" @click="takePicture(), $refs.popover4.close()">
                  <q-icon name="add_a_photo" />
                </q-btn>
                <q-btn flat color="primary">
                  <q-icon name="thumb_down" />
                </q-btn>
                <q-btn flat color="secondary">
                  <q-icon name="share" />
                </q-btn>
          </div>
            </q-popover>
          </q-btn>
        </q-fixed-position>
    <!-- <button id="takePicture" @click='takePicture()' big fill><i class="btn-icon">add_a_photo</i></button> -->
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
