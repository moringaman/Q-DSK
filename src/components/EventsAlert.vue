<template>
  <div id="">
    <div class="label" id="latest">LATEST</div>
    <div class="alert" v-for="(marker, index) in markers">
      <!-- TODO Pass as slot to child where you place show on click logic -->
      <wx-event-anime :marker="marker"></wx-event-anime>
    </div>
  </div>
</template>
<script>
import VueFire from 'vuefire'
import * as firebase from 'firebase'
import Vue from 'vue'
import EventAnime from './EventAnime.vue'
Vue.use(VueFire)
let db = firebase.database()
let markersRef = db.ref('markers').orderByChild('dateTime').limitToLast(5)

export default {
  data: () => ({

  }),
  components: {
    WxEventAnime: EventAnime
  },
  firebase: {
    markers: markersRef
  },
  computed: {
    revMarkers () {
      return this.markers.slice().reverse()
    }
  }
}
</script>
<style lang="css" scoped>
.label {
  background-color: green;
  color: white;
  font-size: 10px;
  font-weight: 900;
  padding: 3px;
  margin-right: 5px;
  margin-bottom: 10px;
}
</style>
