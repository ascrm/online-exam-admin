/** @format */

import { ResPage, User } from '@/api/interface/index'
import { PORT1 } from '@/api/config/servicePort'
import http from '@/api'

/**
 * @name 用户管理模块
 */
// 获取用户列表
export const getUserListApi = (params: { pageNum: number; pageSize: number }) => {
  return http.get<ResPage<User.ResUserList>>(PORT1 + `/users`, params)
}

//新增管理员
export const addUserApi = (params: { username: string }) => {
  return http.post<User.ResUserList>(PORT1 + `/user`, params)
}

// 批量添加用户
export const BatchAddUserApi = (params: FormData) => {
  return http.post(PORT1 + `/user/import`, params)
}

// 删除用户
export const deleteUserApi = (params: { id: number }) => {
  return http.delete(PORT1 + `/user/${params.id}`)
}

// 重置用户密码
export const resetUserPassWordApi = (params: { id: number }) => {
  return http.put(PORT1 + `/user/${params.id}`)
}

// 导出用户数据
export const exportUserInfoApi = (params: User.ReqUserParams) => {
  return http.download(PORT1 + `/user/export`, params)
}
