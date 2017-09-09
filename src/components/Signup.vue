<template>
  <q-layout>
  <div class="layout-view">
    <h4>Sign Up</h4>
    <div class="layout-padding form">
   <!-- <img src="../assets/DarkSkies_Logo.png"> -->
   <div class="floating-label">
     <input required :class="{'has-error':!userName == '' && !userName}" v-model="userName" class="full-width">
     <label><i class="material-icons">email</i>Username</label>
   </div>
        <div class="floating-label">
          <input required :class="{'has-error':!email == '' && !isValid}" v-model="email" class="full-width">
          <label><i class="material-icons">email</i>Your email</label>
        </div>
        <div class="floating-label">
          <input required v-model="password" type="password" class="full-width">
          <label><i class="material-icons">lock</i>Your password</label>
        </div>
        <div class="floating-label">
          <input required v-model="passwordComf" type="password" class="full-width"
          :class="{'has-error':!matchFound}">
          <label><i class="material-icons">lock</i>Confirm password</label>
        </div>
        <button :class="{'disabled':!matchFound || !isValid}" class="light full-width outline big" @click="signUp">Sign Up</button>
        <router-link :to="'/signin'">Already have an account Sign In</router-link>
    </div>
  </div>
</q-layout>
</template>

<script>
import { AppFullscreen } from 'quasar'
import { mapGetters } from 'vuex'

var emailRE = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
// var emailRE = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
export default {
  data () {
    return {
      email: '',
      userName: '',
      password: '',
      passwordComf: '',
      loggedIn: false
    }
  },
  created () {
    AppFullscreen.isActive(true)
    // AppFullscreen.request()
  },
  computed: {
    ...mapGetters({
      loading: 'loading',
      userInfo: 'user'
    }),
    // loading () {
      // return this.$store.getters.loading
    // },
    // userInfo () {
      // return this.$store.getters.user
    // },
    validation: function () {
      return {
        email: emailRE.test(this.email)
      }
    },
    isValid: function () {
      var validation = this.validation
      return Object.keys(validation).every(function (key) {
        return validation[key]
      })
    },
    matchFound: function () {
      return (this.password === this.passwordComf)
    }
  },
  /* watch: {
    loading (value) {
      if (value === true) {
        this.loading = true
      }
      else {
        this.loading = false
      }
    }
  }, */
  methods: {
    signUp () {
          // TODO login to firebase then redirect to app page
      this.$store.dispatch('signUserUp', {email: this.email, username: this.userName, password: this.password})
      // setTimeout(this.createUserProfile, 2000)
    }
  }
}
</script>

<style scoped>

.layout-view-padding {
  height: 2vh;
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
  text-align: center;
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
