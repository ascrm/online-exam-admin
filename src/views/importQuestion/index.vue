<!-- @format -->

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import QuestionTypeItem from './questionTypeItem.vue'
import { cn } from '@/utils/cn'
import { Finished, Select, DocumentAdd, View } from '@element-plus/icons-vue'
import {
  delQuestionsByExamPaperIdAndQuestionIdApi,
  getQuestionsByConditionApi,
  getQuestionsByExamPaperIdAndQuestionTypeApi,
  getQuestionViewerByIdApi,
  importQuestionApi,
} from '@/api/modules/question'
import { ElMessage } from 'element-plus'

interface QuestionProp {
  id: number
  name: string
  questionType: number
  difficulty: number
  description: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  answer: string
  analysis: string
  score: number
  createdBy: string
  createdAt: string
  updatedAt: string
}

interface ExamPaperProp {
  id: number
  name: string
}

const activeIndex = ref(1)
const activeQuestionType = ref(1)
const examPaper = ref<Partial<ExamPaperProp>>({})
onMounted(async () => {
  examPaper.value = JSON.parse(localStorage.getItem('examPaper') as unknown as string)
  await getQuestionList()
  await getQuestionsByExamPaperIdAndQuestionType()
  await totalHandler(1)
  await totalHandler(2)
  await totalHandler(3)
})

//条件查询请求参数
const conditionApiParams = ref({
  name: undefined,
  questionType: undefined,
  difficulty: undefined,
})

//根据条件获取题目列表
const tableData = ref()
const getQuestionList = async () => {
  const { data } = await getQuestionsByConditionApi(conditionApiParams.value)
  tableData.value = data
}

//根据id获取题目详细信息
const questionViewer = ref<Partial<QuestionProp>>({})
const getQuestionViewerById = async (params: number) => {
  const { data } = await getQuestionViewerByIdApi({ id: params })
  questionViewer.value = data as unknown as any
}

//导入题目
const importQuestion = async (params: QuestionProp) => {
  await importQuestionApi({ examPaperId: examPaper.value.id, id: params.id })
  await getQuestionsByExamPaperIdAndQuestionType()
  plusTotalHandler(params)
}

//根据试卷id和题目类别查询当前试卷下的所有题目（包括相信信息）
const questionViewerList = ref<QuestionProp[]>([])
const getQuestionsByExamPaperIdAndQuestionType = async () => {
  const { data } = await getQuestionsByExamPaperIdAndQuestionTypeApi({
    examPaperId: examPaper.value.id,
    questionType: activeQuestionType.value,
  })
  questionViewerList.value = data as unknown as any
}

//切换题目类别
const changeQuestionType = (questionType: number) => {
  activeQuestionType.value = questionType
  activeIndex.value = 0
  questionViewer.value = {}
  getQuestionsByExamPaperIdAndQuestionType()
}

//查看题目详情
const viewQuestionInfo = (id: number) => {
  activeIndex.value = 0
  getQuestionViewerById(id)
}

//切换activeIndex
const changeActiveIndex = (id: number, index: number) => {
  activeIndex.value = index
  getQuestionViewerById(id)
}

//删除添加的题目
const deleteHandler = async (params: any) => {
  await delQuestionsByExamPaperIdAndQuestionIdApi({ examPaperId: examPaper.value.id, questionId: params.id })
  activeIndex.value = 0
  questionViewer.value = {}
  await getQuestionsByExamPaperIdAndQuestionType()
  reduceTotalHandler(params)
}

//重置表单
const resetHandler = () => {
  conditionApiParams.value = {
    name: undefined,
    questionType: undefined,
    difficulty: undefined,
  }
}

//统计已录入的题目数量和分数
const singleCount = ref(0)
const multipleCount = ref(0)
const judgeCount = ref(0)
const totalCount = ref(0)
const totalScores = ref(0)
const totalHandler = async (questionType: number) => {
  const { data } = await getQuestionsByExamPaperIdAndQuestionTypeApi({
    examPaperId: examPaper.value.id,
    questionType,
  })
  if (questionType === 1) singleCount.value = data.length
  if (questionType === 2) multipleCount.value = data.length
  if (questionType === 3) judgeCount.value = data.length
  totalCount.value += data.length
  totalScores.value += data.reduce((acc, cur) => acc + cur.score, 0)
}

//题目数量和分数变化
const plusTotalHandler = (params: any) => {
  totalCount.value += 1
  totalScores.value += params.score

  if (params.questionType === 1) singleCount.value += 1
  if (params.questionType === 2) multipleCount.value += 1
  if (params.questionType === 3) judgeCount.value += 1
}

const reduceTotalHandler = (params: any) => {
  totalCount.value -= 1
  totalScores.value -= params.score
  if (params.questionType === 1) singleCount.value -= 1
  if (params.questionType === 2) multipleCount.value -= 1
  if (params.questionType === 3) judgeCount.value -= 1
}
</script>

<template>
  <div class="grid h-[100%] grid-cols-[1fr_1fr_2fr] gap-4">
    <div class="h-full bg-white">
      <div class="p-[20px] text-center text-[2em]">{{ examPaper.name }}</div>
      <div class="flex justify-between px-[10px] text-[1.2em]">
        <div>已录入题目数：{{ totalCount }}</div>
        <div>总分：{{ totalScores }}</div>
      </div>

      <div class="mt-[30px] px-[5px] [&_.el-icon]:mr-[5px]">
        <div class="flex justify-between px-[5px] py-[3px] text-[1.5em]">
          <div>题目总览</div>
          <div>题数</div>
        </div>
        <QuestionTypeItem
          :class="activeQuestionType === 1 && 'bg-gray-100 text-blue-500'"
          @click="changeQuestionType(1)"
        >
          <template #left>
            <el-icon><Eleme /></el-icon>
            单选题
          </template>
          <template #right>{{ singleCount }}</template>
        </QuestionTypeItem>
        <QuestionTypeItem
          :class="activeQuestionType === 2 && 'bg-gray-100 text-blue-500'"
          @click="changeQuestionType(2)"
        >
          <template #left>
            <el-icon><ElementPlus /></el-icon>
            多选题
          </template>
          <template #right>{{ multipleCount }}</template>
        </QuestionTypeItem>
        <QuestionTypeItem
          :class="activeQuestionType === 3 && 'bg-gray-100 text-blue-500'"
          @click="changeQuestionType(3)"
        >
          <template #left>
            <el-icon><Finished /></el-icon>
            判断题
          </template>
          <template #right>{{ judgeCount }}</template>
        </QuestionTypeItem>
      </div>
      <div class="mt-[40px] grid grid-cols-5 gap-4 px-[20px]">
        <div
          :class="
            cn(
              'flex h-[50px] cursor-pointer items-center justify-center rounded-md bg-gray-100 text-[1.5em] hover:bg-blue-300 hover:text-blue-600',
              index + 1 === activeIndex && 'bg-blue-300 text-blue-600',
            )
          "
          v-for="(item, index) in questionViewerList"
          :key="index"
          @click="changeActiveIndex(item.id, index + 1)"
        >
          <div>
            {{ index + 1 }}
          </div>
          <div :class="'hidden h-[100%] w-[100%] items-center justify-center rounded-md bg-green-300'">
            <el-icon class="text-green-600"><Select /></el-icon>
          </div>
          <div :class="'hidden h-[100%] w-[100%] items-center justify-center rounded-md bg-red-300'">
            <el-icon class="text-red-600"><CloseBold /></el-icon>
          </div>
          <div :class="'hidden h-[100%] w-[100%] items-center justify-center rounded-md bg-blue-300'">
            <el-icon class="text-blue-600"><SemiSelect /></el-icon>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="mb-[20px] h-[250px] bg-white px-[20px] pb-[10px]">
        <div class="py-[10px] text-[1.5em]">筛选题目</div>
        <el-form size="default" :model="conditionApiParams">
          <el-form-item>
            <el-input clearable v-model="conditionApiParams.name" placeholder="请输入题目名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select placeholder="请选择题目类型" clearable v-model="conditionApiParams.questionType">
              <el-option label="单选题" value="1"></el-option>
              <el-option label="多选题" value="2"></el-option>
              <el-option label="判断题" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select placeholder="请选择题目难度" clearable v-model="conditionApiParams.difficulty">
              <el-option label="入门" value="1"></el-option>
              <el-option label="简单" value="2"></el-option>
              <el-option label="普通" value="3"></el-option>
              <el-option label="中等" value="4"></el-option>
              <el-option label="困难" value="5"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="flex items-center justify-end">
          <el-button type="primary" @click="resetHandler">重置</el-button>
          <el-button type="success" @click="getQuestionList">确定</el-button>
        </div>
      </div>
      <el-table size="large" :data="tableData" style="width: 100%; height: calc(100vh - 400px)">
        <el-table-column prop="name" label="题目名称" width="120" />
        <el-table-column prop="questionTypeLabel" label="类型" width="90" />
        <el-table-column prop="difficultyLabel" label="难度" width="90" />
        <el-table-column fixed="right" width="140" label="查看/添加">
          <template #default="scope">
            <el-button type="primary" :icon="View" circle @click="viewQuestionInfo(scope.row.id)"></el-button>
            <el-button type="success" :icon="DocumentAdd" circle @click="importQuestion(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="h-[100%] bg-white">
      <div v-if="questionViewer.id">
        <div class="flex items-center justify-between p-[20px]">
          <div class="flex items-center gap-3">
            <div class="text-[2em]">{{ questionViewer.name }}</div>
            <div class="rounded-xl bg-gray-100 px-[10px] py-[5px] text-[1.2em] text-gray-500">
              分数 {{ questionViewer.score }}
            </div>
          </div>
          <div class="flex gap-3 text-[1.2em] text-gray-500">
            <div>作者 {{ questionViewer.createdBy }}</div>
            <div>创建时间 {{ questionViewer.updatedAt?.split(' ')[0] }}</div>
          </div>
        </div>
        <div class="px-[20px] pb-[20px] text-[1.5em]">
          {{ questionViewer.description }}
        </div>
        <div class="cursor-default pb-[20px]" v-if="questionViewer.questionType === 1">
          <el-radio-group class="block">
            <el-radio>{{ questionViewer.optionA }}</el-radio>
            <el-radio>{{ questionViewer.optionB }}</el-radio>
            <el-radio>{{ questionViewer.optionC }}</el-radio>
            <el-radio>{{ questionViewer.optionD }}</el-radio>
          </el-radio-group>
        </div>
        <div class="px-[20px] pb-[20px] text-[1.5em]">参考答案 {{ questionViewer.answer }}</div>
        <div class="px-[20px] pb-[20px]">
          <div class="text-[1.5em]">题目解析</div>
          <div class="text-[1.2em] text-gray-500">{{ questionViewer.analysis }}</div>
        </div>
        <div class="flex justify-end px-[20px]">
          <el-button type="danger" @click="deleteHandler(questionViewer)">删除</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.el-radio {
  display: block;
  height: auto;
  padding: 10px 20px;
  text-wrap: wrap;
}
</style>
