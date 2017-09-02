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
import { Loading, Dialogue } from 'quasar'
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
        Dialog.create({
          title: 'Confirmation',
          message: 'Do you want to send this',
          buttons: [
            'Cancel',
            {
              label: 'Empty Trash Bin',
              handler () {
        // "this" refers to the scope of this method only,
        // not your Vue component
        // prints: undefined
        // console.log(this.variable)
            }
          },
          'Send',
          {
            Label: 'Process Marker',
            handler () {
              
            }
          }

         ]
      })
      }, (message) => {
        window.alert('FAILED : ' + message)
      }, {
        quality: 75,
        targetWidth: 500,
        targetHeight: 500,
        destinationType: navigator.camera.DestinationType.FILE_URI
      })
    },
    markerCreate: function () {
      let timeTaken = new Date().toLocaleString()
      const markerData = {
        userId: this.user.uid,
        image: this.photo,
        photoUrl: this.photoURL,
        dateTime: timeTaken,
        location: {
          lat: this.$store.getters.location.lat,
          lng: this.$store.getters.location.lng
        }
      }
      // window.alert(JSON.stringify(markerData))
      this.$store.dispatch('createMarker', markerData)
    },
    photoUpload: function () {
      var img = new Image()
      var c = document.createElement('canvas')
      var ctx = c.getContext('2d')
      let storage = firebase.storage()
      let storageRef = storage.ref()
      let filesRef = storageRef.child('images/' + this.markerId + '.jpg')
      // window.alert(img.src)
      img.onload = function () {
        c.width = this.naturalWidth     // update canvas size to match image
        c.height = this.naturalHeight
        ctx.drawImage(this, 0, 0)
        var dataURL = c.toDataURL('image/jpeg', 0.75)
        Loading.show(
          {
            message: 'Posting Photo'
          }
        )
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
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    },
    markerId () {
      return this.$store.getters.markerId
    }
  }
}
</script>

<style lang="css">
</style>
