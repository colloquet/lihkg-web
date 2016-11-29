/* global $ */
import * as types from '../mutation-types'

// initial state
const state = {
  whiteTheme: false
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
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
