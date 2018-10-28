import storage from '@/storage'
import * as types from '../mutation-types'

const initialState = {
  isHoverable: !window.matchMedia('(hover: none)').matches,
  isMobile: window.innerWidth < 768,
  nightMode: storage.get('nightMode') !== false,
  officeMode: storage.get('officeMode') || false,
  staticIcons: storage.get('staticIcons') || false,
  autoLoadImage: storage.get('autoLoadImage') !== false,
  youtubePreview: storage.get('youtubePreview') !== false,
  imageProxy: storage.get('imageProxy') !== false,
  history: storage.get('history') || {},
  bookmarks: storage.get('bookmarks') || [],
  flattenIconMap: {},
}

const getters = {}

const actions = {}

const mutations = {
  [types.SYNC_HISTORY](state, history) {
    state.history = history
  },
  [types.SYNC_SETTINGS](state, { key, value }) {
    state[key] = value
  },
  [types.SET_ICON_MAP](state, flattenIconMap) {
    state.flattenIconMap = flattenIconMap
  },
  [types.SET_HISTORY](state, thread) {
    const history = {
      ...state.history,
      [thread.thread_id]: {
        page: thread.page,
        replies: thread.no_of_reply,
      },
    }
    storage.set('history', history)
    state.history = history
  },
  [types.UPDATE_HISTORY](state, { threadId, postId, page }) {
    const history = {
      ...state.history,
      [threadId]: {
        ...(state.history[threadId] || {}),
        page,
        postId,
      },
    }
    storage.set('history', history)
    state.history = history
  },
  [types.CLEAR_HISTORY](state) {
    storage.set('history', {})
    storage.set('bookmarks', [])
    state.history = {}
    state.bookmarks = []
  },
  [types.TOGGLE_SETTINGS](state, key) {
    const value = !state[key]
    storage.set(key, value)
    state[key] = value
  },
  [types.SET_IS_MOBILE](state, status) {
    state.isMobile = status
  },
  [types.SET_IS_HOVERABLE](state, status) {
    state.isHoverable = status
  },
  [types.ADD_BOOKMARK](state, postId) {
    state.bookmarks.unshift(postId)
    storage.set('bookmarks', state.bookmarks)
  },
  [types.REMOVE_BOOKMARK](state, postId) {
    const index = state.bookmarks.indexOf(postId)
    if (index > -1) {
      state.bookmarks.splice(index, 1)
    }
    storage.set('bookmarks', state.bookmarks)
  },
}

export default {
  state: initialState,
  getters,
  actions,
  mutations,
}
