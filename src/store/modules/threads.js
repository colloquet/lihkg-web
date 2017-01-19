import * as types from '../mutation-types'

// initial state
const state = {
  activeThread: {},
  photoMode: false
}

// getters
const getters = {
  lastLoadedPage (state) {
    return +Object.keys(state.activeThread.item_page)[Object.keys(state.activeThread.item_page).length - 1]
  }
}

// actions
const actions = {
}

// mutations
const mutations = {
  [types.SET_PHOTO_MODE] (state, status) {
    state.photoMode = status
  },
  [types.RESET_THREAD] (state) {
    state.activeThread = {}
  },
  [types.SET_ACTIVE_THREAD] (state, thread) {
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
