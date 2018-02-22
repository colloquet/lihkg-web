import API from '@/api'
import * as types from '../mutation-types'

// initial state
const initialState = {
  isLoading: false,
  isFetchingMedia: false,
  thread: {},
  page: 1,
  storyMode: null,
  mediaList: null,
  mediaIndex: null,
}

// getters
const getters = {
  loadedPages(state) {
    return Object.keys(state.thread.pages || {})
  },
  maxPage(state, _getters) {
    return Math.max(..._getters.loadedPages)
  },
  minPage(state, _getters) {
    return Math.min(..._getters.loadedPages)
  },
  hasNextPage(state, _getters) {
    return _getters.maxPage < state.thread.total_page
  },
  media(state) {
    return state.mediaList[state.mediaIndex]
  },
  hasPrev(state) {
    return state.mediaIndex > 0
  },
  hasNext(state) {
    return state.mediaIndex + 1 !== state.mediaList.length
  },
}

// actions
const actions = {
  async fetchThread(
    { commit, state, dispatch },
    {
      threadId, page = 1, append = false, order = 'reply_time',
    },
  ) {
    if (state.isLoading) return false

    dispatch('startProgress')
    commit(types.SET_THREAD_IS_LOADING, true)
    if (!append) {
      commit(types.SET_THREAD, {})
    }
    try {
      const data = await API.fetchThread({ threadId, page, order })
      if (append) {
        commit(types.APPEND_THREAD, data.response)
      } else {
        commit(types.SET_THREAD, data.response)
      }
      commit(types.SET_THREAD_PAGE, page)
      if (order === 'reply_time') {
        commit(types.SET_HISTORY, data.response)
      }
      return data
    } catch (error) {
      dispatch('handleError', error)
      return false
    } finally {
      commit(types.SET_THREAD_IS_LOADING, false)
      dispatch('stopProgress')
    }
  },
  async fetchMediaList(
    { state, commit, dispatch },
    { threadId, openGallery = false, showProgress = true },
  ) {
    if (state.isFetchingMedia) return

    if (showProgress) {
      dispatch('startProgress')
    }
    commit(types.SET_IS_FETCHING_MEDIA, true)
    try {
      const data = await API.fetchMediaList({ threadId })
      if (data.response.images.length) {
        commit(types.SET_MEDIA_LIST, data.response.images)
        if (openGallery) {
          commit(types.TOGGLE_GALLERY)
        }
      } else {
        alert('找不到媒體')
      }
    } catch (error) {
      dispatch('handleError', error)
    } finally {
      if (showProgress) {
        dispatch('stopProgress')
      }
      commit(types.SET_IS_FETCHING_MEDIA, false)
    }
  },
}

// mutations
const mutations = {
  [types.SET_STORY_MODE](state, storyMode) {
    state.storyMode = storyMode
  },
  [types.SET_THREAD_IS_LOADING](state, value) {
    state.isLoading = value
  },
  [types.SET_THREAD_PAGE](state, page) {
    state.page = page
  },
  [types.SET_THREAD](state, thread) {
    state.thread = {
      ...thread,
      pages: {
        [thread.page]: thread.item_data,
      },
    }
  },
  [types.APPEND_THREAD](state, thread) {
    state.thread = {
      ...thread,
      pages: {
        ...(state.thread.pages || {}),
        [thread.page]: thread.item_data,
      },
    }
  },
  [types.SET_IS_FETCHING_MEDIA](state, value) {
    state.isFetchingMedia = value
  },
  [types.SET_MEDIA_LIST](state, mediaList) {
    state.mediaList = mediaList
  },
  [types.SET_MEDIA_INDEX](state, index) {
    state.mediaIndex = index
  },
}

export default {
  state: initialState,
  getters,
  actions,
  mutations,
}
