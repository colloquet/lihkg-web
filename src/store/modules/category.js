import API from '@/api'
import helper from '@/helper'
import * as types from '../mutation-types'

const initialState = {
  categoryList: [],
  fixedCategoryList: [],
  category: null,
  threadList: [],
  page: 1,
  isLoading: false,
  hasMore: true,
}

const getters = {}

const actions = {
  async fetchThreadList({ commit, state, dispatch }, { catId, page = 1 }) {
    if (state.isLoading) return

    const append = page > 1
    commit(types.SET_CATEGORY_IS_LOADING, true)

    try {
      const data = await API.fetchThreadList({ catId, page })

      if (!data.data.list.length) {
        throw data
      }

      commit(types.SET_CATEGORY, catId)
      if (append) {
        commit(types.APPEND_THREAD_LIST, data.data.list)
      } else {
        commit(types.SET_THREAD_LIST, data.data.list)
      }
      commit(types.SET_CATEGORY_PAGE, page)
      commit(types.SET_CATEGORY_HAS_MORE, true)
    } catch (error) {
      if (!error.data.list.length) {
        commit(types.SET_CATEGORY_HAS_MORE, false)
      } else {
        dispatch('handleError', error)
      }
    } finally {
      commit(types.SET_CATEGORY_IS_LOADING, false)
    }
  },
}

const mutations = {
  [types.SET_CATEGORY_IS_LOADING](state, isLoading) {
    state.isLoading = isLoading
  },
  [types.SET_CATEGORY_LIST](state, categoryList) {
    state.categoryList = categoryList
  },
  [types.SET_FIXED_CATEGORY_LIST](state, fixedCategoryList) {
    state.fixedCategoryList = fixedCategoryList
  },
  [types.SET_CATEGORY_PAGE](state, page) {
    state.page = page
  },
  [types.SET_CATEGORY_HAS_MORE](state, hasMore) {
    state.hasMore = hasMore
  },
  [types.SET_CATEGORY](state, category) {
    state.category = category
  },
  [types.SET_THREAD_LIST](state, threadList) {
    state.threadList = threadList
  },
  [types.APPEND_THREAD_LIST](state, threadList) {
    state.threadList = helper.uniqBy(state.threadList.concat(threadList), 'id')
  },
}

export default {
  state: initialState,
  getters,
  actions,
  mutations,
}
