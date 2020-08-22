import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    allFiles: [],
    isError: false
  },
  mutations: {
    addFile (state, item) {
      state.allFiles.unshift(item)
    },

    isError (state, value) {
      state.isError = value
    }
  },
  actions: {
  },
  modules: {
  }
})
