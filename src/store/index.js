import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import info from './modules/info'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    info
  },
  getters
})

export default store
