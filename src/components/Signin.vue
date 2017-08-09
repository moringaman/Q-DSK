<template>
  <div class="layout-view">
    <div class="layout-padding form">

        <h4>Dark Skies</h4>


        <div class="floating-label">
          <input required v-model="email" class="full-width">
          <label><i class="material-icons">email</i>Your email</label>
        </div>
        <div class="floating-label">
          <input required v-model="password" type="password" class="full-width">
          <label><i class="material-icons">lock</i>Your password</label>
        </div>
        <button class="light full-width outline big" @click="signIn">Sign In</button>

        <small> Sign Up </small>
    </div>
  </div>
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
    AppFullscreen.isActive(true)
    AppFullscreen.request()
  },
  methods: {
    signIn () {
          // TODO login to firebase then redirect to app page
      this.$store.dispatch('signUserIn', {email: this.email, password: this.password})
    }
  }
}
</script>

<style scoped>

.layout-view {
  text-align: center;
}

.form {
  margin-top: 100px;
  margin-left: 0px;
  padding: 10px 50px;


}

input {
  margin-top: 20px;
  width: 90%;
}


input:nth-child(2) {
  margin-bottom: 30px;

}

.layout-view {
  background-image: url(../assets/skygaze.jpg);
  background-size: 110%;
  height: 600px;

}

i {
  color: white;
  margin-right: 10px;
}

button {
  margin-top: 40px;
  margin-left: 20px;
  color: white;
}

h4 {
  color: white;
  margin: 50px auto;
}

</style>
