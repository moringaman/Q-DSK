<template>
  <div>
    <img @click="toggleMarkerDetails" class="thumb" :src="marker.downloadURL"/>
    <p v-show="showMarkerDetails">{{ marker.photoDesc}}</p>
  </div>
</template>
<script>
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
</style>
