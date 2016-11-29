import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import categories from './modules/categories'
import threads from './modules/threads'
import settings from './modules/settings'

Vue.use(Vuex)

export default new Vuex.Store({
  actions,
  getters,
  modules: {
    categories,
    threads,
    settings
  },
  strict: true
})
