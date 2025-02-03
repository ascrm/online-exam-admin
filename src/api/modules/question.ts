/** @format */

import { PORT1 } from '@/api/config/servicePort'
import http from '@/api'

//分页查询题目列表
export const getQuestionListApi = (params: any) => http.get(PORT1 + `/questions`, params)

//新增题目
export const addQuestionApi = (params: any) => http.post(PORT1 + `/question`, params)

//编辑题目
export const editQuestionApi = (params: any) => http.put(PORT1 + `/question`, params)

//删除题目
export const deleteQuestionApi = (params: any) => http.delete(PORT1 + `/question`, params)

//批量删除题目
export const batchDelQuestionApi = (params: any) => http.delete(PORT1 + `/questions`, params)

//根据id获取题目详细信息
export const getQuestionViewerByIdApi = (params: any) => http.get(PORT1 + `/question`, params)

//根据条件查询题目列表
export const getQuestionsByConditionApi = (params: any) => http.post(PORT1 + `/questions/condition`, params)

//导入题目
export const importQuestionApi = (params: any) => http.post(PORT1 + `/exam/question`, params)

//根据试卷id和题目类别查询当前试卷下的所有题目（包括相信信息）
export const getQuestionsByExamPaperIdAndQuestionTypeApi = (params: any) =>
  http.get<any>(PORT1 + `/exam/question`, params)

//根据试卷id和题目id删除已添加的题目
export const delQuestionsByExamPaperIdAndQuestionIdApi = (params: any) => http.delete(PORT1 + `/exam/question`, params)
