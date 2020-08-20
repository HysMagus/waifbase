import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    allFiles: []
  },
  mutations: {
    addFile (state, item) {
      state.allFiles.unshift(item)
    }
  },
  actions: {
  },
  modules: {
  }
})
