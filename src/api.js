const API_ROOT = 'https://lihkg.com/api_v2'

const serialize = obj =>
  Object.keys(obj)
    .map(key => `${key}=${obj[key]}`)
    .join('&')

const request = async (endpoint, params) => {
  const serializedParams = params ? `?${serialize(params)}` : ''
  try {
    const response = await fetch(`${API_ROOT}${endpoint}${serializedParams}`)
    const json = await response.json()
    if (json.success) {
      return json
    }
    throw json
  } catch (error) {
    console.log(error)
    throw error
  }
}

export default {
  fetchSystemProperty() {
    return request('/system/property')
  },
  fetchThreadList({
    catId: cat_id, page = 1, count = 50, ...query
  }) {
    const types = {
      1: 'latest',
      2: 'hot',
      3: 'news',
    }
    const type = types[cat_id] || 'category'

    const params = {
      cat_id,
      page,
      count,
      ...query,
    }

    return request(`/thread/${type}`, params)
  },
  fetchThread({ threadId, page, order }) {
    return request(`/thread/${threadId}/page/${page}`, { order })
  },
  fetchSearchResult({
    query: q, page, sort = 'score', count = 30,
  }) {
    return request('/thread/search', {
      q,
      page,
      sort,
      count,
    })
  },
  fetchMediaList({ threadId }) {
    return request(`/thread/${threadId}/images`)
  },
}
