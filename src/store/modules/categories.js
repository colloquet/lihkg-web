import lihkg from '../../api/lihkg'
import * as types from '../mutation-types'

// initial state
const state = {
  categories: [],
  category: {},
  threads: [],
  page: 1,
  isThreadListLoading: false,
  hasMoreThreads: true
}

// getters
const getters = {
}

// actions
const actions = {
  fetchCategories ({ commit }) {
    lihkg.fetchCategories().then(response => {
      commit('RECEIVE_CATEGORIES', response.data.response.category_list)
    }).catch((e) => {
      console.log(e)
      window.alert('伺服器出錯，請重試。')
    })
  },
  fetchThreadList ({ state, commit }, { catId, page }) {
    commit('SET_LOADING_THRED_LIST', true)
    lihkg.fetchThreadList(catId, page, 50).then(response => {
      commit('RECEIVE_THREAD_LIST', response.data.response.items)
      commit('SET_ACTIVE_CATEGORY', response.data.response.category)
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
  [types.RECEIVE_CATEGORIES] (state, categories) {
    state.categories = categories
  },
  [types.SET_ACTIVE_CATEGORY] (state, category) {
    state.category = category
  },
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
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
