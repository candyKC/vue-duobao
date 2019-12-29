import Vue from 'vue'
import Vuex from 'vuex'
import { USER_ISLOGIN_URL } from './api'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: null
  },
  getters: {
    getUserInfo: state => state.userInfo
  },
  mutations: {
    login (state, data) {
      state.userInfo = data
      localStorage.setItem('user_id', data.id)
    },
    updateUserInfo (state, data) {
      let obj = state.userInfo
      Object.assign(obj, data)
      state.userInfo = obj
    },
    logout (state) {
      state.userInfo = null
      localStorage.removeItem('user_id')
    }
  },
  actions: {
    checkedLogin ({ commit, state }) {
      return new Promise((resolve, reject) => {
        Vue.prototype.$post(USER_ISLOGIN_URL, {}).then((res) => {
          commit('login', res.userInfo)
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
      })
    }
    /* checkedLogin ({ commit, state }) {
      return new Promise((resolve, reject) => {
        Vue.prototype.$post(USER_ISLOGIN_URL, {}).then((res) => {
          if (res.data.code === 0) {
            commit('login', res.data.userInfo)
            resolve(res.data)
          } else {
            reject(res.data)
          }
        }).catch((err) => {
          reject(err.data)
        })
      })
    } */
  }
})
