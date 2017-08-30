<template lang="html">
<div>
  <button class="teal fixed-bottom-right" style="bottom: 50px; right: 80%;">
        <i>add_a_photo</i>
        <q-popover ref="popover4">
          <div class="group" style="width: 200px; height: 50px; text-align: center;">
            <button class="primary clear" @click="takePicture(), $refs.popover4.close()">
              <i>add_a_photo</i>
            </button>
            <button class="primary clear" @click="photoUpload(), $refs.popover4.close()">
              <i>thumb_down</i>
            </button>
          </div>
        </q-popover>
      </button>
    <!-- <button id="takePicture" @click='takePicture()' big fill><i class="btn-icon">add_a_photo</i></button> -->
    <img v-show="photoURL"
    style="width: 200px;
     height: 200px;
     position: absolute;
     bottom: 200px; left: 100px;
     border-radius: 50%" :src="photoURL"/>
  </div>
</template>

<script>
import FilePath from '../helpers/filepath.js'
import * as firebase from 'firebase'
export default {

  data () {
    return {
      photoURL: '',
      photo: '',
      path: ''
    }
  },
  mixins: [FilePath],
  methods: {
    takePicture: function () {
      if (!navigator.camera) {
        window.alert('cordova.camera not found !')
        return
      }
      // TODO Check for geo-position before taking picture
      navigator.camera.getPicture((imageURI) => {
        this.photoURL = imageURI
        // window.alert(imageURI)
        this.photo = imageURI.split('/').pop()
        var filepath = imageURI.split('/').splice(2)
        filepath.pop()
        filepath = filepath.join('/')
        this.path = filepath + '/'
        let timeTaken = new Date().toLocaleString()
        const markerData = {
          userId: this.user.uid,
          image: this.photo,
          dateTime: timeTaken,
          location: {
            lat: this.$store.getters.location.lat,
            lng: this.$store.getters.location.lng
          }
        }
        // window.alert(JSON.stringify(markerData))
        this.$store.dispatch('createMarker', markerData)
      }, (message) => {
        window.alert('FAILED : ' + message)
      }, {
        quality: 25,
        targetWidth: 200,
        targetHeight: 200,
        destinationType: navigator.camera.DestinationType.FILE_URI
      })
    },
    photoUpload: function () {
      var img = new Image()
      var c = document.createElement('canvas')
      var ctx = c.getContext('2d')
      let storage = firebase.storage()
      let storageRef = storage.ref()
      let filesRef = storageRef.child('images/' + this.photo)
      // window.alert(img.src)
      img.onload = function () {
        c.width = this.naturalWidth     // update canvas size to match image
        c.height = this.naturalHeight
        ctx.drawImage(this, 0, 0)
        var dataURL = c.toDataURL('image/jpeg', 0.75)
        filesRef.putString(dataURL, 'data_url')
        .then((snapshot) => {
          window.alert('Uploaded a blob or file!')
          var downloadURL = snapshot.downloadURL
          window.alert(downloadURL)
        }).catch((error) => {
          window.alert(error)
        })
      }
      img.crossOrigin = ''             // if from different origin
      img.src = this.photoURL
    },
    upload: function () {
      var file = this.photoURL
      var blob = new Blob([file], {type: 'image/jpg'})
      let storage = firebase.storage()
      let storageRef = storage.ref()
      let filesRef = storageRef.child('images/' + this.photo)
      filesRef.put(blob, {contentType: 'image/jpg'})
        .then((snapshot) => {
          window.alert('Uploaded a blob or file!')
          var downloadURL = snapshot.downloadURL
          window.alert(downloadURL)
        }).catch((error) => {
          window.alert(error)
        })
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    }
  }
}
</script>

<style lang="css">
</style>
