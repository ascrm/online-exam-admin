/** @format */

import { defineStore } from 'pinia'
import { UserState } from '@/stores/interface'
import piniaPersistConfig from '@/stores/helper/persist'
import { User } from '@/api/interface'

export const useUserStore = defineStore({
  id: 'geeker-user',
  state: (): UserState => ({
    token: '',
    userInfo: {},
  }),
  getters: {},
  actions: {
    // Set Token
    setToken(token: string) {
      this.token = token
    },
    // Set setUserInfo
    setUserInfo(userInfo: User.ResUserList) {
      this.userInfo = userInfo
    },
  },
  persist: piniaPersistConfig('geeker-user'),
})
