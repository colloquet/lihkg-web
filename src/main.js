import Vue from 'vue'
import VueHead from 'vue-head'
import { sync } from 'vuex-router-sync'
import App from './App'
import router from './router'
import store from './store'

sync(store, router)

Vue.use(VueHead)

/* eslint-disable no-new */
new Vue({
  store,
  router,
  el: '#app',
  template: '<App/>',
  components: { App }
})
