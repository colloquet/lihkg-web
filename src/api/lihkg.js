import axios from 'axios'

export default {
  fetchCategories () {
    return axios.get('https://lihkg.com/api_v1/system/property')
  },
  fetchThreadList (catId, page) {
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
        page
      }
    })
  },
  fetchThread (threadId, page) {
    return axios.get(`https://lihkg.com/api_v1/thread/${threadId}/page/${page}`)
  },
  fetchSearchResult (query, page) {
    return axios.get(`https://lihkg.com/api_v1/thread/search?q=${query}&page=${page}&count=30`)
  },
  fetchImages (threadId) {
    return axios.get(`https://lihkg.com/api_v1/thread/${threadId}/images`)
  }
}
