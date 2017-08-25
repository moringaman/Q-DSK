<template>
  <q-layout>
    <gmap-map
    :center="{lat: location.lat, lng: location.lng}"
    :disableDefaultUI="true"
    :zoom="6"
    style="width: 100%; height: 94vh; z-index: 0">
    <gmap-info-window
     :options="infoOptions"
     :position="infoWindowPos"
     :opened="infoWinOpen"
     @closeclick="infoWinOpen=false"> {{ infoContent }}
    </gmap-info-window>
    <gmap-marker
      :key="index"
      v-for="(m, index) in markers"
      :position="m.position"
      :clickable="true"
      :draggable="false"
      @mouseover="statusText = 'Trails seen by ' + m.sender + ' @ ' + m.timestamp + location.lat"
      @mouseout="statusText = null"
      @click="toggleInfoWindow(m,index)"
    ></gmap-marker>
    <div slot="visible">
      <div style="bottom: 0;
       left: 0;
       right: 0;
       line-height: 50px;
       bottom: 10px;
       background-color: rgba(0,0,0, 0.5);
       color: white;
       position: absolute;
       z-index: 100;
       font-size: 20px">
        {{statusText}}
        <app-createnew></app-createnew>
      </div>
    </div>
  </gmap-map>
</q-layout>

</template>

<script>
import CreateNewMarker from '../components/CreateMarker.vue'
 // import Vue from 'vue'
export default {
  components: {
    appCreatenew: CreateNewMarker
  },
  data: function () {
    return {
      center: {lat: 54.0, lng: -1.6},
      statusText: '',
      infoContent: '',
      infoWindowPos: {
        lat: 0,
        lng: 0
      },
      infoWinOpen: false,
      location: '',
      photoURL: '',
      currentMidx: null,
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -35
        }
      }
    }
  },
  computed: {
    markers () {
      return this.$store.getters.loadedMarkers
    },
    user () {
      return this.$store.getters.user
    }
  },
  created () {
    this.getLocation()
    /* this.$store.dispatch('getLocation')
    .then((result) => {
      this.location = this.$store.getters.location
    }) */
  },
  methods: {
    getLocation: function () {
      if (!navigator.geolocation) {
        window.alert('No geo-location')
      }
      navigator.geolocation.getCurrentPosition((position) => {
         // window.alert('{lat: ' + position.coords.latitude + ', lng: ' + position.coords.longitude + '}')
        this.location = {lat: position.coords.latitude, lng: position.coords.longitude}
        return '{lat: ' + position.coords.latitude + ', lng: ' + position.coords.longitude + '}'
      }, (error) => {
        window.alert('FAILED Error #' + error.code + ' ' + error.message)
      }, {
        timeout: 1000,
        enableHighAccuracy: true
      })
    }, /*
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
            lat: this.location.lat,
            lng: this.location.lng
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
    }, */
    toggleInfoWindow: function (marker, idx) {
      this.infoWindowPos = marker.position
      this.infoContent = marker.sender
      // check if its the same marker that was selected if yes toggle
      if (this.currentMidx === idx) {
        this.infoWinOpen = !this.infoWinOpen
      // if different marker set infowindow to open and reset current marker index
      }
      else {
        this.infoWinOpen = true
        this.currentMidx = idx
      }
    }
  }
}
</script>

<style>
.btn-icon {
  font-size: 36px;
}
</style>
