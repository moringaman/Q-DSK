<template>
  <div id="user-history">
   <div v-show="markers" v-for="(marker, key) in markers" :key="marker.sender">
    <div class="card">
     <img :style="{backgroundImage: 'url(\'' + marker.downloadURL + '\' )' , backgroundPosition: 'center center'}" class="thumb"/>
      <div class="card-content">
        {{ marker.dateTime }}
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
  },
  created () {
    console.log(this.markers)
  }
}
</script>
<style lang="css" scoped>
.thumb {
  width: 350px;
  height:200px;

}
</style>
