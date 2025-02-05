/** @format */

import { PORT1 } from '@/api/config/servicePort'
import http from '@/api'

//分页查询试卷列表
export const getExamPaperListApi = (params: { pageNum: number; pageSize: number }) =>
  http.get(PORT1 + `/examPapers`, params)

//新增试卷
export const addExamPaperApi = (params: any) => http.post(PORT1 + `/examPaper`, params)

//编辑试卷
export const editExamPaperApi = (params: any) => http.put(PORT1 + `/examPaper`, params)

//删除试卷
export const deleteExamPaperApi = (params: any) => http.delete(PORT1 + `/examPaper`, params)

//批量删除试卷信息
export const batchDelExamPaperApi = (params: any) => http.delete(PORT1 + `/examPapers`, params)

//条件查询试卷列表
export const getExamPaperByConditionApi = (params: any) => http.post(PORT1 + `/examPaper/condition`, params)

//用户查询考试列表
export const getUserExamListApi = () => http.get(PORT1 + `/examPaper/userExamList`)
