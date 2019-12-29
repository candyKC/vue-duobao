import axios from 'axios'
import qs from 'qs'
import { Dialog, Toast } from 'vant'

let CancelToken = axios.CancelToken
let source = CancelToken.source()

const instance = axios.create({
  timeout: 5000,
  withCredentials: true,
  retry: 4,
  retryDelay: 1000
})

instance.interceptors.request.use((config) => {
  // !config.hideLoading && Toast.loading({ mask: true, duration: 0 })
  if (config.method === 'post' && config.headers['Content-Type'] !== 'multipart/form-data' && config.headers['Content-Type'] !== 'application/json') {
    config.data = qs.stringify(config.data)
  }
  return config
}, (err) => {
  return Promise.reject(err)
})

instance.interceptors.response.use((res) => {
  // Toast.clear()
  if (res.data.code === 0) {
    return res.data
  } else {
    if (res.data.code !== 1108) {
      Dialog.alert({
        title: '警告',
        message: res.data.msg ? res.data.msg : res.data.data
      })
    }
    /* if (res.data.code === 1108) {
      Dialog.confirm({
        title: '温馨提示',
        message: res.data.msg
      }).then(() => {
        console.log(Router)
        Router.push({
          name: 'account',
          query: { redirect: this.$route.fullPath }
        })
      }).catch(() => {})
    } */
    return Promise.reject(res.data)
  }
}, (error) => {
  let config = error.config
  if (!config || !config.retry) return Promise.reject(error)
  config.__retryCount = config.__retryCount || 0
  if (config.__retryCount >= config.retry) {
    // Reject with the error
    Toast.clear()
    Dialog.alert({
      title: '警告',
      message: '网络发生错误',
      showConfirmButton: false
    })
    return Promise.reject(error)
  }
  config.__retryCount += 1
  let backoff = new Promise(function (resolve) {
    setTimeout(function () {
      resolve()
    }, config.retryDelay || 1)
  })
  return backoff.then(function () {
    return instance(config)
  })
})

const post = (url, data, config = {}) => {
  return instance.post(url, data, config)
}

const get = (url, params, config = {}) => {
  return instance.get(url, {
    params: params,
    ...config
  })
}

const all = (promise) => {
  return axios.all(promise)
}

export default {
  install (Vue) {
    Object.defineProperties(Vue.prototype, {
      $get: {
        value: get
      },
      $post: {
        value: post
      },
      $all: {
        value: all
      },
      axiosCancel: {
        value: source
      }
    })
  }
}
