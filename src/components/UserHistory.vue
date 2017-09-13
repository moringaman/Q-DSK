<template>
  <div id="user-history">
   <div v-show="markers" v-for="(marker, key) in markers" :key="marker.sender">
    <div class="card" >
      <div class="card-title" :style="{backgroundImage: 'url(\'' + marker.downloadURL + '\' )' , backgroundPosition: 'center center'}" >
        <spinner v-show="loading" color="#000fff" :size="30" name="hourglass"></spinner>
        <span class="title-text">{{ marker.dateTime }}</span>
      </div>
    <!-- <img :style="{backgroundImage: 'url(\'' + marker.downloadURL + '\' )' , backgroundPosition: 'center center'}" class="thumb"/> -->
      <div class="card-content">
      {{ marker.photoDesc}} <br>
      {{ marker.town}}
      </div>
    </div>
  </div>
  <div v-show="markers.length < 1">
  <h3>You have not posted any data yet!</h3><br>
  <p>You can record your sky pic by clicking on the orange button on the map screen</p>
</div>
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

.title-text {
  background-color: rgba(0,0,0, 0.4);
  padding: 3px 3px;
}

spinner {
  margin-left: 200px;
}
</style>
