import axios from 'axios'

export default {
  fetchCategories () {
    return axios.get('https://lihkg.com/api_v1/system/property')
  },
  fetchThreadList (catId, page, count) {
    let type
    switch (+catId) {
      case 1:
        type = 'latest'
        break
      case 2:
        type = 'hot'
        break
      case 3:
        type = 'news'
        break
      default:
        type = 'category'
    }
    return axios.get(`https://lihkg.com/api_v1/thread/${type}`, {
      params: {
        cat_id: catId,
        page,
        count
      }
    })
  },
  fetchThread (threadID, page) {
    return axios.get(`https://lihkg.com/api_v1/thread/${threadID}/page/${page}`)
  },
  fetchSearchResult (query, page) {
    return axios.get(`https://lihkg.com/api_v1/thread/search?q=${query}&page=${page}&count=30`)
  },
  fetchImages (threadID) {
    return axios.get(`https://lihkg.com/api_v1/thread/${threadID}/images`)
  }
}
