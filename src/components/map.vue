<template>
  <q-layout>
    <div class="timeperiods">
      <ul>
        <li :class="{'active-period': classObject.isDay}" :style="notactive" @click="changePeriod('isDay')">Day</li>
        <li :class="{'active-period': classObject.isWeek}" :style="notactive" @click="changePeriod('isWeek')">Week</li>
        <li :class="{'active-period': classObject.isMonth}" :style="notactive" @click="changePeriod('isMonth')">Month</li>
        <li :class="{'active-period': classObject.isYear}" :style="notactive" @click="changePeriod('isYear')">Year</li>
      </ul>
    </div>
    <gmap-map
    :center="{lat: location.lat, lng: location.lng}"
    :zoom="6"
    :options="options"
    :scaleControl="false"
    style="width: 100%; height: 94vh; z-index: 0">
    <gmap-info-window
     :options="infoOptions"
     :position="infoWindowPos"
     :opened="infoWinOpen"
     @closeclick="infoWinOpen=false"> <img :src="infoPic" class="thumb"/><div><strong>{{ infoContent }}</strong></div>
    </gmap-info-window>
    <gmap-marker
      :key="index"
      v-for="(m, index) in markers"
      :position="m.location"
      :clickable="true"
      :draggable="false"
      @mouseover="statusText = 'Trails seen by ' + m.sender + ' @ ' + m.dateTime + ' in ' + m.town + ' ' + m.country"
      @mouseout="statusText = null"
      @click="toggleInfoWindow(m,index)">
    </gmap-marker>
    <div slot="visible" style="height: 150px; border: 10px solid royalblue;">
      <div style="bottom: 0;
       left: 0;
       right: 0;
       line-height: 25px;
       bottom: 25px;
       background-color: royalblue;
       color: white;
       position: absolute;
       z-index: 100;
       font-size: 20px;
       width: 100vw;
       text-align: center;
       font-size: 14px;">
         {{statusText}}
      </div>
    </div>
    <div slot="visible">
      <div style="
       left: 0;
       right: 0;
       line-height: 50px;
       bottom: 30px;
       background-color: rgba(0,0,0, 0.0);
       color: white;
       position: absolute;
       z-index: 100;
       font-size: 20px">
        <app-createnew :markers="pastMarkers"></app-createnew>
        <div id="counters">
        <i id="user">account_circle</i>
       <div class="mcount" id="worldmarker">{{markerNumber}}</div>
         <i id="world">public</i>
       <div class="mcount" id="usermarker">{{pastMarkers.length}}</div>
        </div>
      </div>
    </div>
  </gmap-map>
  <events-alert class="events-alert"></events-alert>
</q-layout>

</template>

<script>
import CreateNewMarker from '../components/CreateMarker.vue'
import EventsAlert from './EventsAlert.vue'
// import axios from 'axios'
import Vue from 'vue'
export default {
  components: {
    appCreatenew: CreateNewMarker,
    eventsAlert: EventsAlert
  },
  data: function () {
    return {
      center: {lat: 54.0, lng: -1.6},
      statusText: '',
      theme: 'green',
      notactive: {
        backgroundColor: 'rgba(0,0,0,0.4)'
      },
      classObject: {isDay: false},
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
      },
      options: {
        disableDefaultUI: true,
        scrollwheel: false,
        styles: this.$mapstyle()
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
    },
    pastMarkers () {
      return this.$store.getters.userMarkers
    },
    markerNumber () {
      return this.$store.getters.loadedMarkers.length
    },
    markerPeriod () {
      // var markers = this.markers
      // var timePeriod = this.timePeriod
      // markers = markers.filter((marker) => markers.dateTime <  )
      // return markers
    }
  },
  mounted () {
    this.getLocation()
    this.$store.dispatch('loadMarkers')
    console.log('markers: ' + this.markers)
  },
  watch: {
    currentUser: function (val) {
      if (val) {
        this.$store.dispatch('showMessage', {message: 'Welcome back, ' + val.username, color: 'rgba(0,128,0, 0.6)', icon: 'done'})
      }
    },
    '$route' (to, from) {
    // Call resizePreserveCenter() on all maps
      Vue.$gmapDefaultResizeBus.$emit('resize')
    },
    markers: function () {
      Vue.$gmapDefaultResizeBus.$emit('resize')
    }
  },
  methods: {
    getLocation: function () {
      if (!navigator.geolocation) {
        window.alert('No geo-location')
      }
      navigator.geolocation.getCurrentPosition((position) => {
        // window.alert('{lat: ' + parseInt(position.coords.latitude) + ', lng: ' + parseInt(position.coords.longitude) + '}')
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
    },
    setTheme: function (e) {
      this.theme = e
      Vue.$gmapDefaultResizeBus.$emit('resize')
    },
    changePeriod (data) {
      console.log(data)
      let classObject = {}
      classObject[data] = true
      console.log(classObject)
      this.classObject = classObject
    }
  },
  beforeMount () {
    this.$mapstyle(this.theme)
  }
}
</script>

<style>


.btn-icon {
  font-size: 36px;
}
.thumb {
  width: 150px;
  height: 150px;
  border-radius: 3px;
}

.timeperiods {
  position: absolute;
  top: 0px;
  left: -15px;
  z-index: 100;
}

.active-period {
 background-color: green !important;
}

.not-active {
  background-color: rgba(0,0,0,0.4);
}

.timeperiods li {
  list-style: none;
    display: inline-block;
    font-size: 0.7rem;
    line-height: 1rem;
    margin-bottom: 5px;
    margin-right: 5px;
    width: 50px;
    color: white;
    text-transform: uppercase;
    padding: 0px 5px;
    text-align: center;
}



#world {
  background-color: black;
  font-size: 48px;
  border-radius: 50%;
}


#user {
  background-color: green;
  font-size: 48px;
  border-radius: 50%;
}

.innerStatus {
  padding: 10px;
}

.mcount {
  background-color: red;
  height: 20px;
  width: 20px;
  line-height: 20px;
  border-radius: 50%;
  font-size: 10px;
  text-align: center;

}

.events-alert {
  top: 20px;
  right: 15px;

  position: absolute;
  height: 50px;
  z-index: 0;
  text-align: right;
}

.gm-style .gm-style-iw {
            background-color: #3C61AD !important;
            color: white;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            min-height: 100% !important;
            padding-top: 0px;
            padding-bottom: 110px;
            padding-left: 0px;
            padding-right: 200px;
            display: block !important;
                  }

         /*style the arrow*/
        .gm-style div div div div div div div div {
            background-color: #3C61AD !important;
            padding: 0;
            margin: 0;
            padding: 10;
            position: absolute;
            top: 0;
            left: 150px;
            color: #fff;
            font-size: 16px;
        }

  .indicator {
    text-align: center;
    width: 50px;
    height: 50px;
    color: #fff;
    border-radius: 50%;
  /*  display: inline-block; */
  }


  #usermarker {
    position: absolute;
    top: -5px;
    left: 35px;
  }

  #worldmarker {
    position: relative;
    top: 15px;
    left: 25px;
  }

  #markerCount{
    position: relative;
    margin-bottom: 10px;
    padding: 0px;
  }

  #counters {
    margin-bottom: 130px;
    margin-left: 10px;
  }

  .theme_btn {
    position: absolute;
  }

  #light_theme {
    left: 85vw;
    top: 300;
    background-color: skyblue;
  }

  #green_theme {
    left: 85vw;
    top: 40px;
    background-color: limegreen;
  }

  #dark_theme {
    left: 85vw;
    top: 80px;
    background-color: blue;
  }

</style>
