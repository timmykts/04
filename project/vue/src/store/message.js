export default {
  state: {
    message: {
      show: false,

      context: 'success',
      title: ''
    }
  },
  mutations: {
    getMessage (state, {context, title}) {
      state.message.show = true
      state.message.context = context
      state.message.title = title
    },
    hideMessage (state) {
      state.message.show = false
    }
  },
  actions: {
    getMessage ({commit}, {context, title}) {
      commit('getMessage', {context, title})

      setTimeout(() => {
        commit('hideMessage')
      }, 2000)
    }
  },
  getters: {
    message (state) {
      return state.message
    }
  }
}
