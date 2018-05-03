import NProgress from 'nprogress'

NProgress.configure({ showSpinner: false })

export default {
  handleError(store, error) {
    console.log(error)
    alert(error.error || '遇到未知問題')
  },
  startProgress() {
    NProgress.start()
  },
  stopProgress() {
    NProgress.done()
  },
}
