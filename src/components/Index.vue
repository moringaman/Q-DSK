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
      <i>perm_identity</i>
    </button>
    </div>

    <!--
      Replace following "div" with
      "<router-view class="layout-view">" component
      if using subRoutes
    -->
    <div class="layout-view">
    <app-map></app-map>
    <span style="font-size: 12px;">{{ user }}</span>

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
                   <input class="full-width">
                   <label>User Name</label>
                 </div>
               </div>
             </div>
              <div class="item multiple-lines">
               <div class="item-content">
                 <div class="floating-label">
                   <input class="full-width">
                   <label>Country</label>
                 </div>
               </div>
             </div>
             <div class="item multiple-lines">
                <div class="item-content">
                  <div class="floating-label">
                    <textarea placeholder="tell everyone a little about yourself here" class="full-width"></textarea>
                    <label>Interests</label>
                  </div>
                </div>
              </div>
              <hr>
                   <label class="item">
            <div class="item-content has-secondary">
              Events and reminders?
            </div>
            <div class="item-secondary">
              <q-toggle v-model="Events"></q-toggle>
            </div>
          </label>
          <label class="item">
            <div class="item-content has-secondary">
              Newsletter?
            </div>
            <div class="item-secondary">
              <q-toggle v-model="Newsletter" class="green"></q-toggle>
            </div>
          </label>
          <label class="item">
            <div class="item-content has-secondary">
              Tweet my photos
            </div>
            <div class="item-secondary">
              <q-toggle v-model="twitter" class="green"></q-toggle>
            </div>
          </label>
      </div>
            </div>
        </q-drawer>
</q-layout>
</template>

<script>

// import { Utils, Platform } from 'quasar'
import Map from './map.vue'
import firebase from 'firebase'
export default {
  components: {
    appMap: Map
  },
  data () {
    return {
      Events: false,
      Newsletter: true,
      twitter: true
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    },
    loggedIn () {
      return this.$store.getters.signedIn
    }
  },
  methods: {
    signOut () {
      this.$store.dispatch('signOut')
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
    var user = firebase.auth().currentUser
    if (user) {
    // User is signed in.
      this.$store.commit('setUser', user)
    }
    else {
    //  this.$router.push('/signin')
    }
  }
}
</script>

<style scoped>
 .small {
   font-size: 12px;
 }
</style>
