import lihkg from '../../api/lihkg'
import * as types from '../mutation-types'

// initial state
const state = {
  threads: [],
  page: 1,
  count: 50,
  isThreadListLoading: false,
  hasMoreThreads: true,
  activeThread: {}
}

// getters
const getters = {
}

// actions
const actions = {
  fetchThreadList ({ state, commit }, { catID, page }) {
    commit('SET_ACTIVE_CATEGORY', catID)
    commit('SET_LOADING_THRED_LIST', true)
    lihkg.fetchThreadList(catID, page, state.count).then(response => {
      commit('RECEIVE_THREAD_LIST', response.data.response.items)
      commit('SET_LOADING_THRED_LIST', false)
      commit('SET_HAS_MORE_THREADS', true)
    }).catch(() => {
      window.alert('伺服器出錯，請重試。')
    })
  },
  fetchMoreThreadList ({ state, commit }, { catID, page }) {
    commit('SET_LOADING_THRED_LIST', true)
    lihkg.fetchThreadList(catID, page, state.count).then(response => {
      if (response.data.response) {
        commit('RECEIVE_MORE_THREAD_LIST', response.data.response.items)
        commit('SET_HAS_MORE_THREADS', true)
      } else {
        commit('SET_HAS_MORE_THREADS', false)
      }
      commit('SET_LOADING_THRED_LIST', false)
    }).catch(() => {
      window.alert('伺服器出錯，請重試。')
    })
  }
}

// mutations
const mutations = {
  [types.SET_LOADING_THRED_LIST] (state, status) {
    state.isThreadListLoading = status
  },
  [types.RESET_THREADS] (state) {
    state.threads = []
  },
  [types.RECEIVE_THREAD_LIST] (state, threads) {
    state.threads = threads
  },
  [types.RECEIVE_MORE_THREAD_LIST] (state, threads) {
    state.threads = state.threads.concat(threads)
  },
  [types.SET_HAS_MORE_THREADS] (state, status) {
    state.hasMoreThreads = status
  },
  [types.SET_ACTIVE_THREAD] (state, thread) {
    state.activeThread = thread
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
