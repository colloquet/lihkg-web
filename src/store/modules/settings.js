import * as types from '../mutation-types'

// initial state
const state = {
  whiteTheme: JSON.parse(window.localStorage.getItem('whiteTheme')) || false,
  officeMode: JSON.parse(window.localStorage.getItem('officeMode')) || false,
  autoLoadImage: JSON.parse(window.localStorage.getItem('autoLoadImage')) || false,
  youtubePreview: JSON.parse(window.localStorage.getItem('youtubePreview')) || false,
  threadHistory: JSON.parse(window.localStorage.getItem('threadHistory')) || {},
  iconMap: {}
}

// getters
const getters = {
}

// actions
const actions = {
}

// mutations
const mutations = {
  [types.TOGGLE_WHITE_THEME] (state, status) {
    const whiteTheme = !state.whiteTheme
    state.whiteTheme = whiteTheme
    window.localStorage.setItem('whiteTheme', whiteTheme)
  },
  [types.TOGGLE_OFFICE_MODE] (state, status) {
    const officeMode = !state.officeMode
    state.officeMode = officeMode
    window.localStorage.setItem('officeMode', officeMode)
  },
  [types.TOGGLE_AUTO_LOAD_IMAGE] (state, status) {
    const autoLoadImage = !state.autoLoadImage
    state.autoLoadImage = autoLoadImage
    window.localStorage.setItem('autoLoadImage', autoLoadImage)
  },
  [types.TOGGLE_YOUTUBE_PREVIEW] (state, status) {
    const youtubePreview = !state.youtubePreview
    state.youtubePreview = youtubePreview
    window.localStorage.setItem('youtubePreview', youtubePreview)
  },
  [types.UPDATE_HISTORY] (state, post) {
    state.threadHistory[post.id] = {
      page: post.page,
      no_of_reply: post.no_of_reply
    }
    try {
      window.localStorage.setItem('threadHistory', JSON.stringify(state.threadHistory))
    } catch (e) {
      // localStorage.setItem does not work in Safari private mode
      // http://stackoverflow.com/questions/21159301/quotaexceedederror-dom-exception-22-an-attempt-was-made-to-add-something-to-st
      console.log(e)
    }
  },
  [types.SET_ICON_MAP] (state, iconMap) {
    state.iconMap = iconMap
  },
  [types.SET_THREAD_HISTORY] (state, history) {
    state.threadHistory = history
  },
  [types.RESET_THREAD_HISTORY] (state) {
    state.threadHistory = {}
    window.localStorage.removeItem('threadHistory')
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
