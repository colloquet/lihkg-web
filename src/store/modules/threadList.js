import API from '@/api'
import helper from '@/helper'
import * as types from '../mutation-types'

const initialState = {
  threadList: [],
  page: 1,
  isLoading: false,
  hasMore: true,
  threadListType: '',
}

const getters = {}

const actions = {
  async fetchThreadList({ commit, state, dispatch }, { catId, page = 1, ...query }) {
    if (state.isLoading) return

    const append = page > 1
    commit(types.SET_THREAD_LIST_IS_LOADING, true)

    try {
      const data = await API.fetchThreadList({ catId, page, ...query })
      commit(types.SET_CATEGORY, data.response.category)
      if (append) {
        commit(types.APPEND_THREAD_LIST, data.response.items)
      } else {
        commit(types.SET_THREAD_LIST, data.response.items)
      }
      commit(types.SET_THREAD_LIST_PAGE, page)
      commit(types.SET_THREAD_LIST_HAS_MORE, true)
    } catch (error) {
      if (error.error_code === 100) {
        commit(types.SET_THREAD_LIST_HAS_MORE, false)
      } else {
        dispatch('handleError', error)
      }
    } finally {
      commit(types.SET_THREAD_LIST_IS_LOADING, false)
    }
  },
  async fetchThreadListByIds({ commit, state, dispatch }, { threadIds, page = 1, perPage = 25 }) {
    if (state.isLoading) return

    const append = page > 1
    commit(types.SET_THREAD_LIST_IS_LOADING, true)

    const startIndex = (page - 1) * perPage
    const endIndex = startIndex + perPage
    const currentPageIds = threadIds.slice(startIndex, endIndex)

    try {
      const data = await API.fetchThreadListByIds({ threadIds: currentPageIds })
      if (append) {
        commit(types.APPEND_THREAD_LIST, data.response.items)
      } else {
        commit(types.SET_THREAD_LIST, data.response.items)
      }
      commit(types.SET_THREAD_LIST_PAGE, page)
      commit(types.SET_THREAD_LIST_HAS_MORE, true)
    } catch (error) {
      if (error.error_code === 100) {
        commit(types.SET_THREAD_LIST_HAS_MORE, false)
      } else {
        dispatch('handleError', error)
      }
    } finally {
      commit(types.SET_THREAD_LIST_IS_LOADING, false)
    }
  },
}

const mutations = {
  [types.SET_THREAD_LIST_TYPE](state, type) {
    state.threadListType = type
  },
  [types.SET_THREAD_LIST_IS_LOADING](state, isLoading) {
    state.isLoading = isLoading
  },
  [types.SET_THREAD_LIST_PAGE](state, page) {
    state.page = page
  },
  [types.SET_THREAD_LIST_HAS_MORE](state, hasMore) {
    state.hasMore = hasMore
  },
  [types.SET_THREAD_LIST](state, threadList) {
    state.threadList = threadList
  },
  [types.APPEND_THREAD_LIST](state, threadList) {
    state.threadList = helper.uniqBy(state.threadList.concat(threadList), 'thread_id')
  },
}

export default {
  state: initialState,
  getters,
  actions,
  mutations,
}
