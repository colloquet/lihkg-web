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
  fetchThreadList ({ state, commit }, { catId, page }) {
    commit('SET_ACTIVE_CATEGORY', catId)
    commit('SET_LOADING_THRED_LIST', true)
    lihkg.fetchThreadList(catId, page, state.count).then(response => {
      commit('RECEIVE_THREAD_LIST', response.data.response.items)
      commit('SET_LOADING_THRED_LIST', false)
      commit('SET_HAS_MORE_THREADS', true)
    }).catch((e) => {
      console.log(e)
      window.alert('伺服器出錯，請重試。')
    })
  },
  fetchMoreThreadList ({ state, commit }, { catId, page }) {
    commit('SET_LOADING_THRED_LIST', true)
    lihkg.fetchThreadList(catId, page, state.count).then(response => {
      if (response.data.response) {
        commit('RECEIVE_MORE_THREAD_LIST', response.data.response.items)
        commit('SET_HAS_MORE_THREADS', true)
      } else {
        commit('SET_HAS_MORE_THREADS', false)
      }
      commit('SET_LOADING_THRED_LIST', false)
    }).catch((e) => {
      console.log(e)
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
