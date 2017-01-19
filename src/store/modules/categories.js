import uniqBy from 'lodash.uniqby'
import lihkg from '../../api/lihkg'
import * as types from '../mutation-types'

// initial state
const state = {
  categories: [],
  category: {},
  threads: [],
  page: 1,
  isThreadListLoading: false,
  isReplacing: false,
  hasMoreThreads: true
}

// getters
const getters = {
  uniqueThreads (state) {
    return uniqBy(state.threads, 'thread_id')
  }
}

// actions
const actions = {
  async fetchCategories ({ commit }) {
    try {
      const { data } = await lihkg.fetchCategories()
      commit('RECEIVE_CATEGORIES', data.response.category_list)
    } catch (e) {
      console.log(e)
      window.alert('伺服器出錯，請重試。')
    }
  },
  async fetchThreadList ({ commit }, { catId, page }) {
    commit('SET_REPLACING_THRED_LIST', true)
    try {
      const { data } = await lihkg.fetchThreadList(catId, page)
      commit('RECEIVE_THREAD_LIST', data.response.items)
      commit('SET_ACTIVE_CATEGORY', data.response.category)
      commit('SET_HAS_MORE_THREADS', true)
      window.scrollTo(0, 0)
    } catch (e) {
      console.log(e)
      window.alert('伺服器出錯，請重試。')
    }
    commit('SET_REPLACING_THRED_LIST', false)
  },
  async fetchMoreThreadList ({ commit }, { catId, page }) {
    commit('SET_LOADING_THRED_LIST', true)
    try {
      const { data } = await lihkg.fetchThreadList(catId, page)
      if (data.response) {
        commit('RECEIVE_MORE_THREAD_LIST', data.response.items)
        commit('SET_HAS_MORE_THREADS', true)
      } else {
        commit('SET_HAS_MORE_THREADS', false)
      }
    } catch (e) {
      console.log(e)
      window.alert('伺服器出錯，請重試。')
    }
    commit('SET_LOADING_THRED_LIST', false)
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
  [types.SET_REPLACING_THRED_LIST] (state, status) {
    state.isReplacing = status
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
