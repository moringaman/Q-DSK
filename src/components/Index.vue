<template>
  <q-layout>
    <!-- Top menu goes here -->
    <div slot="header" class="toolbar">
      <button class="hide-on-drawer-visible" @click="$refs.leftDrawer.open()">
      <i>menu</i>
    </button>
      <q-toolbar-title :padding="1">
        DarkSkies
      </q-toolbar-title>
      <button class="hide-on-drawer-visible" @click="$refs.rightDrawer.open()">
      <i v-if="imageURL ===''">perm_identity</i>
      <img v-if="imageURL != ''" :src="imageURL" style="height: 35px; width: 35px; border-radius: 50%"/>
    </button>
    </div>

    <!--
      Replace following "div" with
      "<router-view class="layout-view">" component
      if using subRoutes
    -->
    <div class="layout-view">
    <app-map></app-map>
    <!-- <span style="font-size: 12px;">{{ user }}</span> -->

    </div>

    <!-- Left-side Drawer -->
      <q-drawer ref="leftDrawer">
        <div class="toolbar">
          <q-toolbar-title>
            Menu
          </q-toolbar-title>
        </div>
        <div class="list no-border platform-delimiter">
            <q-drawer-link icon="" :to="{path: '/about', exact: true}">
              About
            </q-drawer-link>
            <button class="primary big clear" @click="signOut">Sign Out</button>
          </div>
      </q-drawer>

      <!-- Right-side Drawer -->
        <q-drawer ref="rightDrawer" right-side>
          <div class="toolbar">
            <q-toolbar-title>
              <i class="item-primary">edit</i> Profile Settings
            </q-toolbar-title>
          </div>
            <div class="list">
              <p class="text-center light-paragraph"></p>
              <div class="item multiple-lines">
               <div class="item-content">
                 <div class="floating-label">
                   <input v-model="username"class="full-width">
                   <label>User Name</label>
                 </div>
               </div>
             </div>
              <div class="item multiple-lines">
               <div class="item-content">
                 <div class="floating-label">
                   <input v-model="country" class="full-width">
                   <label>Country</label>
                 </div>
               </div>
             </div>
             <div class="item multiple-lines">
                <div class="item-content">
                  <div class="floating-label">
                    <textarea v-model="interests" placeholder="tell everyone a little about yourself here" class="full-width"></textarea>
                    <label>Interests</label>
                  </div>
                </div>
              </div>
                  <img v-if="imageURL != ''" :src="imageURL" style="height: 80px; width: 80px; margin-left: 50px; border-radius: 50%"/>
                  <img v-if="imageURL === ''" src="../assets/placeholder.png" style="height: 70px; width: 70px; margin-left: 50px;"/>
                  <button style="margin-bottom:30px;" class="primary clear small" @click="onFileSelect">Change</button>
                  <input type="file" style="visibility: hidden; display: none" ref="filepicker" @change="onFileSelected" accept="image/*">
      </div>
            </div>

            <label class="item">
            <div class="item-content has-secondary">
            Events and reminders?
            </div>
            <div class="item-secondary">
            <q-toggle v-model="events"></q-toggle>
            </div>
            </label>
            <label class="item">
            <div class="item-content has-secondary">
            Newsletter?
            </div>
            <div class="item-secondary">
            <q-toggle v-model="newsletter" class="green"></q-toggle>
            </div>
            </label>
            <label class="item">
            <div class="item-content has-secondary">
            Tweet my photos
            </div>
            <div class="item-secondary">
            <q-toggle v-model="twitter" class="red"></q-toggle>
            </div>
            </label>
            <hr>
              <button @click="updateProfile" class="primary" style="margin-left: 60px">Submit Changes</button>
        </q-drawer>
</q-layout>
</template>

<script>

// import { Utils, Platform } from 'quasar'
import Map from './map.vue'
// import firebase from 'firebase'
export default {
  components: {
    appMap: Map
  },
  data () {
    return {
      country: '',
      interests: '',
      events: false,
      newsletter: true,
      twitter: true,
      imageURL: '',
      image: null,
      username: '',
      filename: ''
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    },
    loggedIn () {
      return this.$store.getters.signedIn
    },
    userProfile () {
      return this.$store.getters.currentUser
    }
  },
  methods: {
    signOut () {
      this.$store.dispatch('signOut')
    },
    onFileSelect () {
      this.$refs.filepicker.click()
    },
    onFileSelected (event) {
      const files = event.target.files
      console.log(files)
      let filename = files[0].name
      this.filename = filename
      console.log(filename)
      if (filename.lastIndexOf('.') <= 0) {
        window.alert('please select a valid file')
      }
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.imageURL = fileReader.result
      })
      fileReader.readAsDataURL(files[0])
      this.image = files[0]
    },
    updateProfile () {
      var profileData = {
        events: this.events,
        newsletter: this.newsletter,
        country: this.country,
        twitter: this.twitter,
        image: this.image,
        fileName: this.filename,
        userId: this.user.uid,
        username: this.username,
        interests: this.interests
      }
      this.$store.dispatch('userProfileUpdate', profileData)
    }
  },
  watch: {
    loggedIn () {
      // this.$router.push('/signin')
    }
  },
  beforeDestroy () {

  },
  created () {
    this.country = this.userProfile.country
    this.username = this.userProfile.username
    this.twitter = this.userProfile.twitter
    this.interests = this.userProfile.interests
    this.imageURL = this.userProfile.avatarURL
    this.newsletter = this.userProfile.newsletter
    this.events = this.userProfile.events
    console.log('Image URL: ' + this.imageURL)
  }
}
</script>

<style scoped>
 .small {
   font-size: 12px;
 }
</style>
