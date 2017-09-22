<template>
  <div id="">
    <div class="alert" v-for="(marker, index) in markers">
      <!-- TODO Pass as slot to child where you place show on click logic -->
    <img @click="toggleMarkerDetails" class="thumb" :src="marker.downloadURL"/>
    <p v-show="showMarkerDetails">{{ marker.photoDesc}}</p>
    </div>
  </div>
</template>
<script>
import VueFire from 'vuefire'
import * as firebase from 'firebase'
import Vue from 'vue'
Vue.use(VueFire)
let db = firebase.database()
let markersRef = db.ref('markers').orderByChild('dateTime').limitToLast(5)

export default {
  data: () => ({
    showMarkerDetails: false
  }),
  firebase: {
    markers: markersRef
  },
  methods: {
    toggleMarkerDetails () {
      if (this.showMarkerDetails) {
        this.showMarkerDetails = false
      }
      else {
        this.showMarkerDetails = true
      }
    }
  }
}
</script>
<style lang="css" scoped>

.thumb {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #ffffff;
}

p {
  color: black;
}
</style>
