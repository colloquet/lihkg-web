/* global $ */
import * as types from '../mutation-types'

// initial state
const state = {
  whiteTheme: false,
  autoLoadImage: false
}

// getters
const getters = {
}

// actions
const actions = {
}

// mutations
const mutations = {
  [types.TOGGLE_WHITE_THEME] (state, status) {
    state.whiteTheme = !state.whiteTheme
    $('html').toggleClass('white-theme')
  },
  [types.TOGGLE_AUTO_LOAD_IMAGE] (state, status) {
    state.autoLoadImage = !state.autoLoadImage
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
