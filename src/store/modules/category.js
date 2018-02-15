import API from '@/api'
import * as types from '../mutation-types'

function uniqBy(originalArray, objKey) {
  const trimmedArray = []
  const values = []
  let value

  for (let i = 0; i < originalArray.length; i += 1) {
    value = originalArray[i][objKey]

    if (values.indexOf(value) === -1) {
      trimmedArray.push(originalArray[i])
      values.push(value)
    }
  }

  return trimmedArray
}

// initial state
const initialState = {
  categoryList: [],
  fixedCategoryList: [],
  category: {},
  threadList: [],
  page: 1,
  isLoading: false,
  hasMore: true,
}

// getters
const getters = {}

// actions
const actions = {
  async fetchThreadList({ commit, state, dispatch }, { catId, page = 1, ...query }) {
    if (state.isLoading) return

    const append = page > 1
    commit(types.SET_CATEGORY_IS_LOADING, true)

    try {
      const data = await API.fetchThreadList({ catId, page, ...query })
      commit(types.SET_CATEGORY, data.response.category)
      if (append) {
        commit(types.APPEND_THREAD_LIST, data.response.items)
      } else {
        commit(types.SET_THREAD_LIST, data.response.items)
      }
      commit(types.SET_CATEGORY_PAGE, page)
      commit(types.SET_CATEGORY_HAS_MORE, true)
    } catch (error) {
      if (error.error_code === 100) {
        commit(types.SET_CATEGORY_HAS_MORE, false)
      } else {
        dispatch('handleError', error)
      }
    } finally {
      commit(types.SET_CATEGORY_IS_LOADING, false)
    }
  },
}

// mutations
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
    state.threadList = uniqBy(state.threadList.concat(threadList), 'thread_id')
  },
}

export default {
  state: initialState,
  getters,
  actions,
  mutations,
}
