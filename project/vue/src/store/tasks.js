import firebase from 'firebase/app'

import Task from './task_help'

export default {
  state: {
    tasks: []
  },
  mutations: {
    loadTasks (state, payload) {
      state.tasks = payload
    },
    newTask (state, payload) {
      state.tasks.push(payload)
    },
    editTask (state, {id, title, description}) {
      const task = state.tasks.find(t => {
        return t.id === id
      })
      task.title = title
      task.description = description
    },
    completedTask (state, {id, completed}) {
      const task = state.tasks.find(t => {
        return t.id === id
      })
      task.completed = completed
    }
  },
  actions: {
    async loadTasks ({commit}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const task = await firebase.database().ref('tasks').once('value')
        const tasks = task.val()
        const tasksArray = []
        Object.keys(tasks).forEach(key => {
          const t = tasks[key]
          tasksArray.push(
            new Task(
              t.title,
              t.description,
              t.whatWatch,
              t.time,
              t.tags,
              t.completed,
              t.editing,
              t.user,
              key
            )
          )
        })
        commit('loadTasks', tasksArray)

        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },

    async newTask ({commit, getters}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {

        const newTask = new Task(
          payload.title,
          payload.description,
          payload.whatWatch,
          payload.time,
          payload.tags,
          payload.completed,
          payload.editing,
          getters.user.id
        )

        const task = await firebase.database().ref('tasks').push(newTask)


        commit('newTask', {
          ...newTask,
          id: task.key
        })

        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },

    async editTask ({commit}, {id, title, description}) {
      commit('clearError')
      commit('setLoading', true)
      try {

        await firebase.database().ref('tasks').child(id).update({
          title,
          description
        })

        commit('editTask', {id, title, description})

        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },

    async completedTask ({commit}, {id, completed}) {
      commit('clearError')
      commit('setLoading', true)
      try {

        await firebase.database().ref('tasks').child(id).update({completed})

        commit('completedTask', {id, completed})

        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },

    async deleteTask ({commit}, id) {
      commit('clearError')
      commit('setLoading', true)
      try {
        await firebase.database().ref('tasks').child(id).remove()

        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    }
  },
  getters: {

    tasks (state, getters) {
      return state.tasks.filter(task => {
        return task.user === getters.user.id
      })
    },

    taskCompleted (state, getters) {
      return getters.tasks.filter(task => {
        return task.completed
      })
    },

    taskNotCompleted (state, getters) {
      return getters.tasks.filter(task => {
        return task.completed === false
      })
    }
  }
}
