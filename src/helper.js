const helper = {
  ytRegex: /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=))([\w-]{10,12})(?:[&?#].*?)*?(?:[&?#]start|t=(\d+|[\dhm]+s))?$/,
  lihkgRegex: /^(?:https?:\/\/)?lihkg\.com\/(?:t|thread)\/(\d+)/,
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
  isOverflown(element) {
    return element.scrollWidth > element.clientWidth
  },
  getRelativeTime(timestamp) {
    const current = Math.floor(Date.now() / 1000)
    const secondPerMinute = 60
    const secondPerHour = secondPerMinute * 60
    const secondPerDay = secondPerHour * 24
    const secondPerMonth = secondPerDay * 30
    const secondPerYear = secondPerDay * 365

    const elapsed = current - (timestamp / 1000)

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
    const date = new Date(timestamp)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = `0${date.getHours()}`.substr(-2)
    const minutes = `0${date.getMinutes()}`.substr(-2)
    const seconds = `0${date.getSeconds()}`.substr(-2)

    return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`
  },
  parseDuration(duration) {
    const matches = duration.match(/[0-9]+[hms]/g)
    let seconds = 0

    if (!matches) {
      return duration
    }

    matches.forEach((part) => {
      const unit = part.charAt(part.length - 1)
      const amount = parseInt(part.slice(0, -1), 10)

      switch (unit) {
        case 'h':
          seconds += amount * 60 * 60
          break
        case 'm':
          seconds += amount * 60
          break
        case 's':
          seconds += amount
          break
        default:
        // noop
      }
    })

    return seconds
  },
  uniqBy(originalArray, objKey) {
    const trimmedArray = []
    const values = []
    let value

    for (let i = 0; i < originalArray.length; i += 1) {
      value = originalArray[i][objKey]

      if (values.indexOf(value) === -1) {
        trimmedArray.push(originalArray[i])
        values.push(value)
      }
    }

    return trimmedArray
  },
  topicsMap: {
    BW: '吹水台',
    HT: '高登熱',
    NW: '最　新',
    OP: '考古台',
    ET: '娛樂台',
    CA: '時事台',
    FN: '財經台',
    GM: '遊戲台',
    HW: '硬件台',
    IN: '電訊台',
    SW: '軟件台',
    MP: '手機台',
    AP: 'Apps台',
    SP: '體育台',
    LV: '感情台',
    SY: '講故台',
    ED: '飲食台',
    BB: '親子台',
    PT: '寵物台',
    TR: '旅遊台',
    CO: '潮流台',
    AN: '動漫台',
    TO: '玩具台',
    MU: '音樂台',
    VI: '影視台',
    DC: '攝影台',
    ST: '學術台',
    SC: '校園台',
    WK: '上班台',
    TS: '汽車台',
    RA: '電　台',
    AU: '成人台',
    MB: '站務台',
    AC: '活動台',
    JT: '直播台',
    EP: '創意台',
    BS: '買賣台',
  },
  fixedTopicList: [
    {
      name: '推薦',
      cat_list: [
        { cat_id: 'HT', name: '高登熱' },
        { cat_id: 'NW', name: '最　新' },
        { cat_id: 'CA', name: '時事台' },
        { cat_id: 'ET', name: '娛樂台' },
        { cat_id: 'SP', name: '體育台' },
        { cat_id: 'FN', name: '財經台' },
        { cat_id: 'ST', name: '學術台' },
        { cat_id: 'SY', name: '講故台' },
        { cat_id: 'EP', name: '創意台' },
        { cat_id: 'BW', name: '吹水台' },
      ],
    },
    {
      name: '數碼',
      cat_list: [
        { cat_id: 'HW', name: '硬件台' },
        { cat_id: 'IN', name: '電訊台' },
        { cat_id: 'SW', name: '軟件台' },
        { cat_id: 'MP', name: '手機台' },
        { cat_id: 'AP', name: 'Apps台' },
      ],
    },
    {
      name: '消閒',
      cat_list: [
        { cat_id: 'GM', name: '遊戲台' },
        { cat_id: 'ED', name: '飲食台' },
        { cat_id: 'TR', name: '旅遊台' },
        { cat_id: 'CO', name: '潮流台' },
        { cat_id: 'AN', name: '動漫台' },
        { cat_id: 'TO', name: '玩具台' },
        { cat_id: 'MU', name: '音樂台' },
        { cat_id: 'VI', name: '影視台' },
        { cat_id: 'DC', name: '攝影台' },
        { cat_id: 'TS', name: '汽車台' },
      ],
    },
    {
      name: '生活',
      cat_list: [
        { cat_id: 'WK', name: '上班台' },
        { cat_id: 'LV', name: '感情台' },
        { cat_id: 'SC', name: '校園台' },
        { cat_id: 'BB', name: '親子台' },
        { cat_id: 'PT', name: '寵物台' },
      ],
    },
    {
      name: '其他',
      cat_list: [
        { cat_id: 'MB', name: '站務台' },
        { cat_id: 'RA', name: '電　台' },
        { cat_id: 'AC', name: '活動台' },
        { cat_id: 'BS', name: '買賣台' },
        { cat_id: 'JT', name: '直播台' },
        { cat_id: 'AU', name: '成人台' },
        { cat_id: 'OP', name: '考古台' },
      ],
    },
  ],
}

export default helper
