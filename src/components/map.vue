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
     @closeclick="infoWinOpen=false"> <strong>{{ infoContent }}</strong><img :src="infoPic" class="thumb"/>
    </gmap-info-window>
    <gmap-marker
      :key="index"
      v-for="(m, index) in markers"
      :position="m.location"
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
// import axios from 'axios'
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
      infoPic: '',
      infoWindowPos: {
        lat: 0,
        lng: 0
      },
      infoWinOpen: false,
      location: {},
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
    },
    currentUser () {
      if (!this.$store.getters.currentUser) {
        return
      }
      return this.$store.getters.currentUser
    },
    lastMarker () {
      return this.$store.getters.lastMarker
    }
  },
  created () {
    this.getLocation()
    this.$store.dispatch('loadMarkers')
    console.log(this.markers)
    // axios.get('http://maps.googleapis.com/maps/api/geocode/json?latlng=53.42308026896434,-1.353393416106956&sensor=true')
    //  .then(response => {
    //    console.log(response.data.results[2].formatted_address)
    //  })
  },
  watch: {
    currentUser: function (val) {
      this.$store.dispatch('showMessage', {message: 'Welcome back, ' + val.username, color: 'rgba(0,128,0, 0.6)', icon: 'done'})
    }
  },
  methods: {
    getLocation: function () {
      if (!navigator.geolocation) {
        window.alert('No geo-location')
      }
      navigator.geolocation.getCurrentPosition((position) => {
         // window.alert('{lat: ' + position.coords.latitude + ', lng: ' + position.coords.longitude + '}')
        this.location = {lat: parseInt(position.coords.latitude), lng: parseInt(position.coords.longitude)}
        return '{lat: ' + position.coords.latitude + ', lng: ' + position.coords.longitude + '}'
      }, (error) => {
        window.alert('FAILED Error #' + error.code + ' ' + error.message)
      }, {
        timeout: 1000,
        enableHighAccuracy: true
      })
    },
    toggleInfoWindow: function (marker, idx) {
      this.infoWindowPos = marker.location
      this.infoContent = marker.sender
      this.infoPic = marker.downloadURL
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
.thumb {
  width: 70px;
  height: 70px;
  border-radius: 3px;
}
</style>
