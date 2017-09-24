<template>
  <div class="main">
    <img @click="toggleMarkerDetails" class="thumb" :src="marker.downloadURL"/>
    <template v-if="showMarkerDetails">
      <transition name="fade">
      <div class="marker-detail">
        {{marker.town | firstWord}}, {{marker.country}} <br>
          {{marker.dateTime | timeAgo}}
      </div>
    </transition>
    </template>
  </div>
</template>
<script>
import moment from 'moment'

export default {

  data: () => ({
    showMarkerDetails: false
  }),
  props: ['marker'],
  methods: {
    toggleMarkerDetails () {
      if (this.showMarkerDetails) {
        this.showMarkerDetails = false
      }
      else {
        this.showMarkerDetails = true
        setTimeout(() => {
          this.showMarkerDetails = false
        }, 3000)
      }
    }
  },
  filters: {
    timeAgo (value) {
      let dateTime
      var datePart = value.slice(0, 10)
      var timePart = value.slice(11, 17)
      datePart = datePart.split('/').reverse().join('-')
      dateTime = datePart + timePart
      let timeVal = moment(dateTime).startOf('minute').fromNow()
      return timeVal
    },
    firstWord (value) {
      let firstWord = value.substr(0, value.indexOf(' '))
      return firstWord
    }
  },
  watch: {
    marker (value) {
      this.toggleMarkerDetails()
    }
  }
}
</script>
<style lang="css" scoped>

.thumb {
  width: 50px;
  height: 50px;
  margin-bottom: 5px;
  border-radius: 50%;
  border: 1px solid #ffffff;
  right: 40;
}

template {

}

.main {
  max-height: 50px;
  display: block;
  margin-bottom: 5px;
}

.marker-detail {
  position: relative;
  display: block;
  background: rgba(0,0,0,0.7);
  color: #ffffff;
  top: -55px;
  right: 50px;
  z-index: -1;
  border-radius: 10px;
  font-size: 12px;
  height: 45px;
  padding: 5px 10px;
  text-align: left;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 1500ms ease-in
}
.fade-leave-active {
  transition: opacity 500ms linear;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}


</style>
