/** @format */

import { PORT1 } from '@/api/config/servicePort'
import http from '@/api'

//新建历史记录
export const addHistoryExamApi = (params: any) => http.post(PORT1 + `/historyExam`, params)