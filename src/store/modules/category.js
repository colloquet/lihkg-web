import * as types from '../mutation-types'

const initialState = {
  categoryList: [],
  fixedCategoryList: [],
  category: {},
}

const getters = {}

const actions = {}

const mutations = {
  [types.SET_CATEGORY_LIST](state, categoryList) {
    state.categoryList = categoryList
  },
  [types.SET_FIXED_CATEGORY_LIST](state, fixedCategoryList) {
    state.fixedCategoryList = fixedCategoryList
  },
  [types.SET_CATEGORY](state, category) {
    state.category = category
  },
}

export default {
  state: initialState,
  getters,
  actions,
  mutations,
}
