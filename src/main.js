// import 'babel-polyfill'
// import 'whatwg-fetch'
import Vue from 'vue'
import Meta from 'vue-meta'
import VueWaypoint from 'vue-waypoint'
import headroom from 'vue-headroom'
import VueLazyload from 'vue-lazyload'

import 'normalize.css/normalize.css'
import 'nprogress/nprogress.css'

import helper from '@/helper'
import * as types from '@/store/mutation-types'
import App from './App'
import router from './router'
import store from './store'

Vue.config.productionTip = false
Vue.use(VueLazyload, {
  lazyComponent: true,
})
Vue.use(VueWaypoint)
Vue.use(Meta)
Vue.use(headroom)

fetch('https://x.lihkg.com/hkgmoji6.json')
  .then(response => response.json())
  .then((hkgmoji) => {
    const flattenIconMap = hkgmoji.reduce(
      (set, current) => ({
        ...set,
        ...current.icons.reduce((all, icon) => ({
          ...all,
          [icon[1]]: icon[0],
        }), {}),
      }),
      {},
    )
    store.commit('SET_ICON_MAP', flattenIconMap)
  })

window.addEventListener('storage', (event) => {
  if (event.key === 'history') {
    store.commit(types.SYNC_HISTORY, JSON.parse(event.newValue))
  }
  if (
    event.key === 'officeMode' ||
    event.key === 'staticIcons' ||
    event.key === 'autoLoadImage' ||
    event.key === 'nightMode'
  ) {
    store.commit(types.SYNC_SETTINGS, {
      key: event.key,
      value: JSON.parse(event.newValue),
    })
  }
})

helper.initYoutube()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
})
