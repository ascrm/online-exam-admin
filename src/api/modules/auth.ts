/** @format */

import { Login, User } from '@/api/interface/index'
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
  http.post<{ token: string; userInfo: User.ResUserList }>(PORT1 + `/login`, params, { loading: false })

// 获取菜单列表
export const getAuthMenuListApi = () => {
  const userStore = useUserStore()
  if (userStore.userInfo.role == '管理员' || userStore.userInfo.role == '1') {
    return adminMenuList
  }

  return userMenuList
}

// 获取按钮权限
export const getAuthButtonListApi = () => authButtonList

// 用户退出登录
export const logoutApi = () => http.post(PORT1 + `/logout`)

//获取验证码
export const getConfirmCodeApi = (params: any) => http.get(PORT1 + `/code`, params)

//修改密码
export const updatePasswordApi = (params: any) => http.put(PORT1 + `/password`, params)
