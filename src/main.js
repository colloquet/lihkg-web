import 'es6-promise/auto'
import 'array-findindex-polyfill'
import axios from 'axios'
import Vue from 'vue'
import Meta from 'vue-meta'
import { sync } from 'vuex-router-sync'
import App from './App'
import router from './router'
import store from './store'

sync(store, router)

Vue.use(Meta)

const init = async () => {
  const { data: hkgmoji } = await axios.get('https://x.lihkg.com/hkgmoji.json')
  const iconMap = hkgmoji.reduce((set, current) => ({
    ...set,
    [current.cat]: current.icons.reduce((icons, map) => ({
      ...icons,
      [map[1]]: map[0]
    }), {})
  }), {})
  store.commit('SET_ICON_MAP', iconMap)

  /* eslint-disable no-new */
  new Vue({
    store,
    router,
    el: '#app',
    template: '<App/>',
    components: { App }
  })
}

init()
