export default {
  async method ({commit}, payload) {
    commit('clearError')
    commit('setLoading', true)
    try {


      commit('setLoading', false)
    } catch (error) {


      commit('setLoading', false)
      commit('setError', error.message)
      throw error
    }
  }
}
