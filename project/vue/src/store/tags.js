import firebase from 'firebase/app'

import Tag from './tag_help'

export default {
  state: {
    tags: []
  },
  mutations: {
    loadTags (state, payload) {
      state.tags = payload
    },
    newTag (state, payload) {
      state.tags.push(payload)
    }
  },
  actions: {
    async loadTags ({commit}) {
      commit('clearError')
      commit('setLoading', true)
      try {

        const tag = await firebase.database().ref('tags').once('value')

        const tags = tag.val()

        const tagsArray = []

        Object.keys(tags).forEach(key => {
          const t = tags[key]
          tagsArray.push(
            new Tag(
              t.title,
              t.use,
              t.user,
              key
            )
          )
        })

        commit('loadTags', tagsArray)

        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },

    async newTag ({commit, getters}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {

        const newTag = new Tag(
          payload.title,
          payload.use,
          getters.user.id
        )

        const tag = await firebase.database().ref('tags').push(newTag)

        commit('newTag', {
          ...newTag,
          id: tag.key
        })

        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },

    async deleteTag ({commit}, id) {
      commit('clearError')
      commit('setLoading', true)
      try {
        await firebase.database().ref('tags').child(id).remove()

        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    }
  },
  getters: {

    tags (state, getters) {
      return state.tags.filter(tag => {
        return tag.user === getters.user.id
      })
    }
  }
}
