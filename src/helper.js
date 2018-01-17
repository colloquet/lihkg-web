const helper = {
  isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
  },
  trackEvent({ eventCategory, eventAction, eventLabel }) {
    if (window.ga) {
      window.ga('send', 'event', eventCategory, eventAction, eventLabel)
    }
  },
  initYoutube() {
    if (!window.YT) {
      const tag = document.createElement('script')
      const firstScriptTag = document.getElementsByTagName('script')[0]
      tag.src = 'https://www.youtube.com/iframe_api'
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
    }
  },
  elementInViewport(el) {
    let top = el.offsetTop

    while (el.offsetParent) {
      el = el.offsetParent
      top += el.offsetTop
    }

    return top >= window.pageYOffset
  },
  getRelativeTime(timestamp) {
    const current = Math.floor(Date.now() / 1000)
    const secondPerMinute = 60
    const secondPerHour = secondPerMinute * 60
    const secondPerDay = secondPerHour * 24
    const secondPerMonth = secondPerDay * 30
    const secondPerYear = secondPerDay * 365

    const elapsed = current - timestamp

    if (elapsed < secondPerMinute) {
      return '剛剛'
    } else if (elapsed < secondPerHour) {
      return `${Math.round(elapsed / secondPerMinute)} 分鐘前`
    } else if (elapsed < secondPerDay) {
      return `${Math.round(elapsed / secondPerHour)} 小時前`
    } else if (elapsed < secondPerMonth) {
      return `${Math.round(elapsed / secondPerDay)} 日前`
    } else if (elapsed < secondPerYear) {
      return `${Math.round(elapsed / secondPerMonth)} 個月前`
    }

    return `${Math.round(elapsed / secondPerYear)} 年前`
  },
  getConvertedTime(timestamp) {
    const date = new Date(timestamp * 1000)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = `0${date.getHours()}`
    const minutes = `0${date.getMinutes()}`
    const seconds = `0${date.getSeconds()}`

    return `${year}年${month}月${day}日 ${hours.substr(-2)}:${minutes.substr(-2)}:${seconds.substr(-2)}`
  },
  getUsernameClass(level, gender) {
    if (Number(level) === 999) return 'color-admin'
    return gender === 'M' ? 'color-male' : 'color-female'
  },
  getScoreClass(score, isDislike = false) {
    if (Number(score) >= 100) return isDislike ? 'color-female' : 'color-admin'
    return Number(score) <= -100 ? 'color-female' : ''
  },
  categoryList: {
    一般: [
      { cat_id: '1', name: '吹水台' },
      { cat_id: '31', name: '創意台' },
      { cat_id: '2', name: '熱　門' },
      { cat_id: '12', name: '講故台' },
      { cat_id: '3', name: '最　新' },
      { cat_id: '18', name: '學術台' },
    ],
    新聞: [
      { cat_id: '5', name: '時事台' },
      { cat_id: '7', name: '娛樂台' },
      { cat_id: '33', name: '政事台' },
      { cat_id: '15', name: '財經台' },
    ],
    科技: [
      { cat_id: '4', name: '手機台' },
      { cat_id: '22', name: '硬件台' },
      { cat_id: '9', name: 'Apps台' },
      { cat_id: '26', name: '軟件台' },
      { cat_id: '35', name: '電訊台' },
    ],
    生活: [
      { cat_id: '30', name: '感情台' },
      { cat_id: '14', name: '上班台' },
      { cat_id: '16', name: '飲食台' },
      { cat_id: '19', name: '校園台' },
      { cat_id: '17', name: '旅遊台' },
      { cat_id: '27', name: '活動台' },
    ],
    興趣: [
      { cat_id: '6', name: '體育台' },
      { cat_id: '10', name: '遊戲台' },
      { cat_id: '11', name: '影視台' },
      { cat_id: '8', name: '動漫台' },
      { cat_id: '23', name: '攝影台' },
      { cat_id: '21', name: '音樂台' },
      { cat_id: '20', name: '汽車台' },
      { cat_id: '25', name: '寵物台' },
      { cat_id: '13', name: '潮流台' },
      { cat_id: '24', name: '玩具台' },
      { cat_id: '34', name: '直播台' },
      { cat_id: '29', name: '成人台' },
    ],
    其他: [{ cat_id: '28', name: '站務台' }, { cat_id: '32', name: '黑　洞' }],
  },
}

export default helper
