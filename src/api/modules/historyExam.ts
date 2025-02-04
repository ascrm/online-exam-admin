/** @format */

import { PORT1 } from '@/api/config/servicePort'
import http from '@/api'

//新建历史记录
export const addHistoryExamApi = (params: any) => http.post(PORT1 + `/historyExam`, params)

//提交答案
export const submitAnswerApi = (params: any) => http.post(PORT1 + `/historyExamQuestion`, params)

//查询单条历史记录
export const getHistoryExamQuestionApi = (params: any) => http.get(PORT1 + `/historyExamQuestion`, params)