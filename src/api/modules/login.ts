/** @format */

import { Login } from '@/api/interface/index'
import { PORT1 } from '@/api/config/servicePort'
import adminMenuList from '@/assets/json/adminMenuList.json'
import userMenuList from '@/assets/json/userMenuList.json'
import authButtonList from '@/assets/json/authButtonList.json'
import http from '@/api'
import { useUserStore } from '@/stores/modules/user'

/**
 * @name 登录模块
 */
// 用户登录
export const loginApi = (params: Login.ReqLoginForm) =>
  http.post<{ token: string; user: string }>(PORT1 + `/login`, params, { loading: false })

// 获取菜单列表
export const getAuthMenuListApi = () => {
  const userStore = useUserStore()
  const token = userStore.token
  const permission = token.split(';')[1]
  if (permission === '1') {
    return adminMenuList
  }

  return userMenuList
}

// 获取按钮权限
export const getAuthButtonListApi = () => {
  // return http.get<Login.ResAuthButtons>(PORT1 + `/auth/buttons`, {}, { loading: false })
  return authButtonList
}

// 用户退出登录
export const logoutApi = () => {
  return http.post(PORT1 + `/logout`)
}
