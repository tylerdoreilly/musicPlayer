import { ref } from 'vue'
import api from '../utils/api'

export function useApi() {
  const loading = ref(false)
  const error = ref(null)

  const request = async (method, url, data = null, config = {}) => {
    loading.value = true
    error.value = null

    try {
      const response = await api({
        method,
        url,
        data,
        ...config
      })
      return response
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const get = (url, config = {}) => request('GET', url, null, config)

  const post = (url, data = {}, config = {}) => request('POST', url, data, config)

  const put = (url, data = {}, config = {}) => request('PUT', url, data, config)

  const patch = (url, data = {}, config = {}) => request('PATCH', url, data, config)

  const del = (url, config = {}) => request('DELETE', url, null, config)

  return {
    loading,
    error,
    get,
    post,
    put,
    patch,
    delete: del,
    request
  }
}
