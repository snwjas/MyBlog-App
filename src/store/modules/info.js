import { getAttributes, getAboutMe } from '@/api'

const getDefaultState = () => {
  return {
    // 博客属性
    attributes: {},
    // 博主信息
    profile: {}
  }
}

const state = getDefaultState()

const mutations = {
  SET_ATTRIBUTES: (state, attributes) => {
    state.attributes = attributes
  },
  SET_PROFILE: (state, profile) => {
    state.profile = profile
  }
}

const actions = {
  // get blog's attributes
  getAttributes({ commit }) {
    return new Promise((resolve, reject) => {
      getAttributes().then(response => {
        const { status, data } = response
        if (status !== 200) {
          return reject('获取博客属性出错')
        }
        commit('SET_ATTRIBUTES', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user's profile
  getProfile({ commit }) {
    return new Promise((resolve, reject) => {
      getAboutMe().then(response => {
        const { status, data } = response
        if (status !== 200) {
          return reject('获取博主信息出错')
        }
        commit('SET_PROFILE', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

