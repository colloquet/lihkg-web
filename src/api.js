const API_ROOT = 'https://hkg-api.ireserve.me'

const serialize = obj =>
  Object.keys(obj)
    .map(key => `${key}=${obj[key]}`)
    .join('&')

const request = async (endpoint, params) => {
  const serializedParams = params ? `?${serialize(params)}` : ''
  try {
    const response = await fetch(`${API_ROOT}${endpoint}${serializedParams}`)
    const json = await response.json()
    if (json.result) {
      return json
    }
    throw json
  } catch (error) {
    console.log(error)
    throw error
  }
}

export default {
  fetchThreadList({ catId, page = 1 }) {
    return request(`/api/topics/${catId}/${page}`)
  },
  fetchThread({ threadId, page = 1 }) {
    return request(`/api/view/${threadId}/${page}`)
  },
}
