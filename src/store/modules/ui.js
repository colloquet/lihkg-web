import * as types from '../mutation-types'

const initialState = {
  showDrawer: false,
  showSettingsModal: false,
  showGallery: false,
}

const getters = {}

const actions = {}

const mutations = {
  [types.TOGGLE_DRAWER](state) {
    state.showDrawer = !state.showDrawer
  },
  [types.OPEN_DRAWER](state) {
    state.showDrawer = true
  },
  [types.HIDE_DRAWER](state) {
    state.showDrawer = false
  },
  [types.TOGGLE_SETTINGS_MODAL](state) {
    state.showSettingsModal = !state.showSettingsModal
  },
  [types.TOGGLE_GALLERY](state) {
    state.showGallery = !state.showGallery
  },
  [types.HIDE_GALLERY](state) {
    state.showGallery = false
  },
}

export default {
  state: initialState,
  getters,
  actions,
  mutations,
}
