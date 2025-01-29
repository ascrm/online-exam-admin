/** @format */

import { PORT1 } from '@/api/config/servicePort'
import http from '@/api'

//分页查询题目列表
export const getQuestionListApi = (params: any) => http.get(PORT1 + `/questions`, params)
