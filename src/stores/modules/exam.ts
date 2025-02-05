/** @format */

import { defineStore } from 'pinia'
import piniaPersistConfig from '../helper/persist'

export const useExamStore = defineStore({
  id: 'exam',
  state: () => ({ temporaryQuestions: [] as any[] }),
  getters: {
    getTemporaryQuestions: state => state.temporaryQuestions,
    getTemporaryQuestionById: state => {
      return (id: number) => state.temporaryQuestions.find(item => item.id === id)
    },
  },
  actions: {
    addTemporaryQuestion(question: any) {
      this.temporaryQuestions.push(question)
    },
    setTemporaryQuestions(questions: any[]) {
      this.temporaryQuestions = questions
    },
    updateTemporaryQuestion(question: any) {
      const index = this.temporaryQuestions.findIndex(item => item.id === question.id)
      if (index !== -1) {
        this.temporaryQuestions.splice(index, 1, question)
      }
    },
    clearTemporaryQuestions() {
      this.temporaryQuestions = []
    },
  },
  persist: piniaPersistConfig('exam'),
})
