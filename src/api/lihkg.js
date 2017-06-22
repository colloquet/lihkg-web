import axios from 'axios'

const baseUrl = 'https://lihkg.com/api_v1_1'

export default {
  fetchCategories () {
    return axios.get(`${baseUrl}/system/property`)
  },
  fetchThreadList (catId, page, rangeType = 'now', order = 'now') {
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
    const params = {
      cat_id: catId,
      page,
      type,
      order
    }
    if (rangeType) {
      params.type = rangeType
    }
    return axios.get(`${baseUrl}/thread/${type}`, {
      params
    })
  },
  fetchThread (threadId, page) {
    return axios.get(`${baseUrl}/thread/${threadId}/page/${page}`)
  },
  fetchSearchResult (query, page, sort = 'score') {
    return axios.get(`${baseUrl}/thread/search`, {
      params: {
        q: query,
        page,
        sort,
        count: 30
      }
    })
  },
  fetchImages (threadId) {
    return axios.get(`${baseUrl}/thread/${threadId}/images`)
  }
}
