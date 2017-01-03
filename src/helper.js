import moment from 'moment'

moment.locale('zh-hk')

export default {
  getRelativeTime (timestamp) {
    return moment.unix(timestamp).fromNow()
  }
}
