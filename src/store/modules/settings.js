/* global $ */
import * as types from '../mutation-types'

// initial state
const state = {
  whiteTheme: false,
  autoLoadImage: false,
  threadInfiniteScroll: false,
  threadHistory: {}
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
  },
  [types.TOGGLE_THREAD_INFINITE_SCROLL] (state, status) {
    state.threadInfiniteScroll = !state.threadInfiniteScroll
  },
  [types.UPDATE_HISTORY] (state, post) {
    state.threadHistory[post.id] = {
      page: post.page,
      no_of_reply: post.no_of_reply
    }
    try {
      window.localStorage.setItem('threadHistory', JSON.stringify(state.threadHistory))
    } catch (e) {
      // localStorage.setItem does not work in Safari private mode
      // http://stackoverflow.com/questions/21159301/quotaexceedederror-dom-exception-22-an-attempt-was-made-to-add-something-to-st
      console.log(e)
    }
  },
  [types.SET_THREAD_HISTORY] (state, history) {
    state.threadHistory = history
  },
  [types.RESET_THREAD_HISTORY] (state) {
    state.threadHistory = {}
    window.localStorage.removeItem('threadHistory')
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
