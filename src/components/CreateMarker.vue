<template lang="html">
  <button class="teal fixed-bottom-right" style="bottom: 10px; right: 80%;">
        <i>add_a_photo</i>
        <q-popover ref="popover4">
          <div class="group" style="width: 200px; height: 50px; text-align: center;">
            <button class="primary clear" @click="takePicture(), $refs.popover4.close()">
              <i>add_a_photo</i>
            </button>
            <button class="primary clear" @click="photoUpload(), $refs.popver4.close()">
              <i>thumb_down</i>
            </button>
          </div>
        </q-popover>
      </button>
    <!-- <button id="takePicture" @click='takePicture()' big fill><i class="btn-icon">add_a_photo</i></button> -->
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
      navigator.camera.getPicture((imageURI) => {
        this.photoURL = imageURI
        this.photo = imageURI.split('/').pop()
        var filepath = imageURI.split('/')
        filepath.pop()
        filepath = filepath.join('/')
        this.path = filepath
        // window.alert(this.path)
        // upload the file
        /* cordova.file.readAsArrayBuffer(this.path, this.photo)
          .then(function (success) {
              // success
            window.alert(success)
            var blob = new Blob([success], {type: 'file/jpg'})
            window.alert(blob)
          })
          .catch((error) => {
            window.alert(error)
          })
           var uploadTask = firebase.storageRef.child('images/' + this.photo).put(blob)
            uploadTask.on('state_changed', function (snapshot) {
              // Observe state change events such as progress, pause, and resume
              // See below for more detail
              var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              console.log('Upload is ' + progress + '% done')
            }, function (error) {
              // Handle unsuccessful uploads
              window.alert('Error uploading: ' + error)
            }, function () {
              // Handle successful uploads on complete
              // For instance, get the download URL: https://firebasestorage.googleapis.com/...
              var downloadURL = uploadTask.snapshot.downloadURL
              window.alert('Success!', downloadURL)
            })
          }, function (error) {
              // error
            window.alert('Failed to read video file from directory', error.code)
          }) */
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
        quality: 50,
        destinationType: navigator.camera.DestinationType.FILE_URI
      })
    },
    photoUpload: function () {
      window.alert('uploading photo')
      cordova.file.readAsArrayBuffer(this.path, this.photo)
        .then(function (success) {
          var blob = new Blob([success], {type: 'image/jpeg'})
          var storageRef = firebase.storage().ref()
          var imageImagesRef = storageRef.child('images/' + this.photo)
          var uploadTask = imageImagesRef.put(blob)
          uploadTask.on('state_changed', function (snapshot) {
            window.alert(snapshot)
          }, function (error) {
            window.alert(error)
          }, function () {
            var downloadURL = uploadTask.snapshot.downloadURL
            window.alert(downloadURL)
          })
        }, function (error) {
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
