<template>
  <q-layout>
  <div class="layout-view">
    <div class="layout-padding form">
   <img src="../assets/DarkSkies_Logo.png">
        <div class="floating-label">
          <input required v-model="email" class="full-width">
          <label><i class="material-icons">email</i>Your email</label>
        </div>
        <div class="floating-label">
          <input required v-model="password" type="password" class="full-width">
          <label><i class="material-icons">lock</i>Your password</label>
        </div>
        <button class="light full-width outline big" @click="signIn">Sign In</button>
        <router-link :to="'/signup'">Register new account</router-link>
    </div>
  </div>
</q-layout>
</template>

<script>
import { AppFullscreen } from 'quasar'

export default {
  data () {
    return {
      email: '',
      password: '',
      loggedIn: false
    }
  },
  created () {
    // Set fullscreen mode
    AppFullscreen.isActive(true)
   // Get Current location
    this.$store.dispatch('getLocation')
   .then((result) => {
     this.location = this.$store.getters.location
   })
  },
  computed: {

  },
  watch: {
    loading (value) {
      if (value === true) {
        this.loading = true
      }
      else {
        this.loading = false
      }
    }
  },
  methods: {
    signIn () {
          // TODO login to firebase then redirect to app page
      this.$store.dispatch('signUserIn', {email: this.email, password: this.password})
      .then((result) => {
        this.$router.push('/')
      })
      .catch((error) => {
        this.$store.dispatch('showMessage', {message: error, color: 'rgba(255,0,0, 0.6)'})
      })
    }
  }
}
</script>

<style scoped>

.layout-view {
  text-align: center;
}

.form {
  margin-top: 50px;
  margin-left: 0px;
  padding: 10px 50px;


}

input {
  margin-top: 30px;
  width: 90%;
}
 img {
   width: 25vh;
   margin-bottom: 5vh;
 }

input:nth-child(2) {
  margin-bottom: 40px;

}

.layout-view {
  background-image: url(../assets/skygaze.jpg);
  background-size: 120%;
  height: 100vh;

}

i {
  color: rgba(250,250,250, 0.5);
  margin-right: 10px;
  font-size: 24px;
}

button {
  margin-top: 30px;
  margin-bottom: 20px;
  margin-left: 20px;
  color: white;
  border: 0px solid rgba(250,250,250, 0.5);
}


h4 {
  color: white;
  margin: 50px auto;
}

small {
  margin-top: 20px;
  color: rgba(250,250,250, 0.5);
  font-size: 1em;
}

</style>
