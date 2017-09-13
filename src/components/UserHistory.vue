<template>
  <div id="user-history">
   <div v-show="markers" v-for="(marker, key) in markers" :key="marker.sender">
    <div class="card" >
      <div class="card-title" :style="{backgroundImage: 'url(\'' + marker.downloadURL + '\' )' , backgroundPosition: 'center center'}" >
        {{ marker.dateTime }}
      </div>
    <spinner v-show="loading"></spinner>
    <!-- <img :style="{backgroundImage: 'url(\'' + marker.downloadURL + '\' )' , backgroundPosition: 'center center'}" class="thumb"/> -->
      <div class="card-content">

       {{ marker.photoDesc}} Location: {{ marker.town}}
      </div>
    </div>
  </div>
  <div v-show="!markers">
  <h2>You have not posted any data yet!</h2></div>
  </div>
</template>
<script>
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
  mounted () {
    console.log(this.markers)
  },
  watch: {
    markers (val) {
      console.log('watched: ' + JSON.stringify(val))
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
</style>
