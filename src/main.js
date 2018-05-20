import 'babel-polyfill'
import 'intersection-observer'
import Vue from 'vue'
import Meta from 'vue-meta'
import VueLazyload from 'vue-lazyload'
import VueObserveVisibility from 'vue-observe-visibility'

import 'normalize.css/normalize.css'
import 'nprogress/nprogress.css'

import helper from '@/helper'
import * as types from '@/store/mutation-types'
import App from './App'
import router from './router'
import store from './store'
import API from './api'
import './assets/font.css'

Vue.config.productionTip = false
Vue.use(VueLazyload, {
  lazyComponent: true,
})
Vue.use(Meta)
Vue.use(VueObserveVisibility)

Vue.directive('username', (el, { value: user }) => {
  if (+user.level === 999) {
    el.className += ' color-admin'
  } else if (user.gender === 'M') {
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

async function fetchIconMap() {
  const response = await fetch('https://x.lihkg.com/hkgmoji9.json')
  const hkgmoji = await response.json()
  const flattenIconMap = hkgmoji.reduce(
    (set, current) => ({
      ...set,
      ...current.icons.reduce(
        (all, icon) => ({
          ...all,
          [icon[1]]: icon[0],
        }),
        {},
      ),
    }),
    {},
  )
  return flattenIconMap
}

async function fetchSystemProperty() {
  const { response } = await API.fetchSystemProperty()
  return response
}

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

async function init() {
  const [iconMap, systemProperty] = await Promise.all([fetchIconMap(), fetchSystemProperty()])

  // remove 自選台
  const fixedCategoryList = systemProperty.fixed_category_list
  fixedCategoryList[0].cat_list = fixedCategoryList[0].cat_list.filter(cat => +cat.cat_id !== 999)

  store.commit('SET_ICON_MAP', iconMap)
  store.commit('SET_CATEGORY_LIST', systemProperty.category_list)
  store.commit('SET_FIXED_CATEGORY_LIST', fixedCategoryList)
}

init()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
})
