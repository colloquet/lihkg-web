import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions'
import app from './modules/app'
import ui from './modules/ui'
import category from './modules/category'
import thread from './modules/thread'
import threadList from './modules/threadList'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    ui,
    category,
    thread,
    threadList,
  },
  actions,
  strict: true,
})
