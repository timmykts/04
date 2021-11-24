import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Uimini from 'uimini/dist/css/uimini.css'

import App from './App'
import router from './router'
import store from './store'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'



Vue.use(
  Vuelidate,
  Uimini
)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created () {

    let config = {


    }
    firebase.initializeApp(config)


    firebase.auth().onAuthStateChanged(user => {
      if (user) {

        this.$store.dispatch('loggedUser', user)

        this.$store.dispatch('loadTasks')

        this.$store.dispatch('loadTags')
        console.log(this.$store.getters.message.title)
      }
    })
  }
})
