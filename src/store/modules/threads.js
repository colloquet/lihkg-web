import * as types from '../mutation-types'

// initial state
const state = {
  activeThread: {},
  photoMode: false
}

// getters
const getters = {
}

// actions
const actions = {
}

// mutations
const mutations = {
  [types.SET_PHOTO_MODE] (state, status) {
    state.photoMode = status
  },
  [types.SET_ACTIVE_THREAD] (state, thread) {
    state.activeThread = thread
  },
  [types.APPEND_ACTIVE_THREAD] (state, thread) {
    state.activeThread = {
      ...thread,
      item_page: {
        ...state.activeThread.item_page,
        [thread.page]: thread.item_data
      }
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
