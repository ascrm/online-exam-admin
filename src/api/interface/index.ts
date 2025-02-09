/** @format */

// 请求响应参数（不包含data）
export interface Result {
  code: string
  msg: string
}

// 请求响应参数（包含data）
export interface ResultData<T = any> extends Result {
  data: T
}

// 分页响应参数
export interface ResPage<T> {
  list: T[]
  pageNum: number
  pageSize: number
  total: number
}

// 分页请求参数
export interface ReqPage {
  pageNum: number
  pageSize: number
}

// 文件上传模块
export namespace Upload {
  export interface ResFileUrl {
    fileUrl: string
  }
}

// 登录模块
export namespace Login {
  export interface ReqLoginForm {
    username: string
    password: string
    confirmPassword: ''
  }
}

// 用户管理模块
export namespace User {
  export interface ReqUserParams extends ReqPage {
    username: string
    gender: number
    idCard: string
    email: string
    address: string
    createTime: string[]
    status: number
  }
  export interface ResUserList {
    id: string
    username: string
    password: string
    role: string
    nickName: string
    gender: number
    avatar: string
    email: string
    phone: string
    createTime: string
  }
}
