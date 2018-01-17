import NProgress from 'nprogress'
// import * as types from './mutation-types'

NProgress.configure({ showSpinner: false })

export default {
  handleError(store, error) {
    console.log(error)
    alert(error.error_message || '遇到未知問題')
  },
  startProgress() {
    NProgress.start()
  },
  stopProgress() {
    NProgress.done()
  },
}
