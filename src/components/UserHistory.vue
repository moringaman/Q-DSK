<template>
  <div id="user-history">
   <div v-for="(Marker, key) in pastMarkers" :key="Marker.sender">
    <div class="card">
     <img :style="{backgroundImage: 'url(\'' + Marker.downloadURL + '\' )' , backgroundPosition: 'center center'}" class="thumb"/>
      <div class="card-content">
        {{ Marker.dateTime }}
       {{ Marker.photoDesc}} Location: ____
      </div>
    </div>
  </div>
  </div>
</template>
<script>
export default {
  name: 'user-history',
  data: () => ({

  }),
  computed: {
    pastMarkers () {
      return this.$store.getters.userMarkers
    }
  }
}
</script>
<style lang="css" scoped>
.thumb {
  width: 350px;
  height:200px;

}
</style>
