<template>
  <div id="user-history">
   <div v-show="markers" v-for="(marker, key) in markers" :key="marker.sender">
    <div class="card" >
      <div class="card-title" :style="{backgroundImage: 'url(\'' + marker.downloadURL + '\' )' , backgroundPosition: 'center center'}" >
        <spinner v-show="loading" color="#000fff" :size="30" name="hourglass"></spinner>
        <p class="title-text">
          {{ marker.town | firstWord }}, {{ marker.country}}</p>
           <p class="title-text"> {{ marker.dateTime | dateFormat }}
          </span>
      </p>
    <!-- <img :style="{backgroundImage: 'url(\'' + marker.downloadURL + '\' )' , backgroundPosition: 'center center'}" class="thumb"/> -->
      <!--<div class="card-content">
      {{ marker.photoDesc}} <br>
      {{ marker.town}}
    </div> -->
    </div>
  </div>
  <div v-show="markers.length < 1">
  <h3>You have not posted any data yet!</h3><br>
  <p>You can record your sky pic by clicking on the orange button on the map screen</p>
</div>
  </div>
</div>
</template>
<script>

import moment from 'moment'

export default {
  name: 'user-history',
  data: () => ({

  }),
  props: {
    markers: Array
  },
  computed: {
    loading () {
      return this.$store.getters.loading
    }
  },
  filters: {
    dateFormat: function (value) {
      var date = null
      var dateTime
      if (!value) return ''
      var datePart = value.slice(0, 10)
      var timePart = value.slice(11, 17)
      datePart = datePart.split('/').reverse().join('-')
      dateTime = datePart + timePart
      console.log(dateTime)
      date = moment(dateTime).calendar()  // .format('MMMM Do YYYY, hh:mm:ss a')
      return date
    },
    firstWord (value) {
      let firstWord = value.substr(0, value.indexOf(' '))
      return firstWord
    }
  },
  mounted () {
    console.log(this.markers)
  },
  watch: {
    markers (val) {
      // console.log('watched: ' + JSON.stringify(val))
    }
  }
}
</script>
<style lang="css" scoped>
.thumb {
  width: 350px;
  height:200px;

}

.card-content {
  background-color: #07559B;
  color: #D1D2D3;
}
.card-title {
  height: 150px;
  color: #D1D2D3;
}

.title-text {
  background-color: rgba(0,0,0, 0.4);
  padding: 3px 5px;
  font-size: 14px;
  margin-bottom: 0px;
  line-height:  14px;
  margin-left: -15px;
}

spinner {
  margin-left: 200px;
}
</style>
