import lihkg from '../../api/lihkg'
import * as types from '../mutation-types'

// initial state
const state = {
  categories: [],
  activeCategoryID: null
}

// getters
const getters = {
  activeCategory (state) {
    return state.categories.filter(category => state.activeCategoryID === category.cat_id)[0]
  }
}

// actions
const actions = {
  fetchCategories ({ commit }) {
    lihkg.fetchCategories().then(response => {
      commit('RECEIVE_CATEGORIES', response.data.response.category_list)
    }).catch(() => {
      window.alert('伺服器出錯，請重試。')
    })
  }
}

// mutations
const mutations = {
  [types.RECEIVE_CATEGORIES] (state, categories) {
    state.categories = categories
  },
  [types.SET_ACTIVE_CATEGORY] (state, catID) {
    state.activeCategoryID = catID
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
