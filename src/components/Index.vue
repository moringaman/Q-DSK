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
              Options
            </q-toolbar-title>
          </div>
          <div class="list no-border platform-delimiter">
              <q-drawer-link icon="" :to="{path: '/', exact: true}">
                Sign Out
              </q-drawer-link>
            </div>
        </q-drawer>
</q-layout>
</template>

<script>

// import { Utils, Platform } from 'quasar'
import Map from './map.vue'
export default {
  components: {
    appMap: Map
  },
  data () {
    return {

    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    }
  },
  methods: {
    signOut () {
      this.$store.dispatch('signOut')
    }
  },
  mounted () {

  },
  beforeDestroy () {

  }
}
</script>

<style scoped>
 .small {
   font-size: 12px;
 }
</style>
