import 'babel-polyfill'
import 'intersection-observer'
import Vue from 'vue'
import Meta from 'vue-meta'
import headroom from 'vue-headroom'
import VueLazyload from 'vue-lazyload'
import VueObserveVisibility from 'vue-observe-visibility'

import 'normalize.css/normalize.css'
import 'nprogress/nprogress.css'

import helper from '@/helper'
import * as types from '@/store/mutation-types'
import App from './App'
import router from './router'
import store from './store'
import './assets/font.css'

Vue.config.productionTip = false
Vue.use(VueLazyload, {
  lazyComponent: true,
})
Vue.use(Meta)
Vue.use(headroom)
Vue.use(VueObserveVisibility)

Vue.directive('username', (el, { value: gender }) => {
  if (gender === 1) {
    el.className += ' color-male'
  } else {
    el.className += ' color-female'
  }
})

Vue.directive('score', (el, { value: score, arg }) => {
  if (+score >= 100) {
    el.className += arg === 'dislike' ? ' color-female' : ' color-admin'
  } else if (+score <= -100) {
    el.className += ' color-female'
  }
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
  render: h => h(App),
})
