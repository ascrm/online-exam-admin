<!-- @format -->

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Finished } from '@element-plus/icons-vue'
import { getHistoryExamQuestionsApi } from '@/api/modules/historyExam'
import router from '@/routers'
import { useExamStore } from '@/stores/modules/exam'
import { cn } from '@/utils/cn'
import historyExamOptionItem from './components/historyExamOptionItem.vue'

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
  duration: number
  score: number
  createdBy: string
  createdAt: string
  updatedAt: string
}

const questionAnswer = ref<{
  singleAnswer?: string
  multipleAnswer?: string[]
  judgeAnswer?: string
}>({})
const activeItem = ref<Partial<QuestionProp>>({})
const examStore = useExamStore()
const examPaper = ref<Partial<ExamPaperProp>>({})
onMounted(async () => {
  examPaper.value = JSON.parse(localStorage.getItem('examPaper') as unknown as string)
  await getHistoryExamQuestions()
})

//查询该用户当前试卷的所有题目历史记录
const singleList = ref<any[]>([])
const multipleList = ref<any[]>([])
const judgeList = ref<any[]>([])
const getHistoryExamQuestions = async () => {
  const { data }: any = await getHistoryExamQuestionsApi({ examPaperId: examPaper.value.id })
  singleList.value = data.filter(item => item.questionType === 1)
  multipleList.value = data.filter(item => item.questionType === 2)
  judgeList.value = data.filter(item => item.questionType === 3)
  examStore.setTemporaryQuestions(data)
}

//切换activeItem
const changeActiveItem = (item: any) => {
  activeItem.value = examStore.getTemporaryQuestionById(item.id)
  changeAnswer()
  console.log(questionAnswer.value)
  const questions = examStore.getTemporaryQuestions
  const typeQuestions = questions.filter(item => item.questionType === activeItem.value.questionType)
  const index = typeQuestions.findIndex(item => item.id === activeItem.value.id)
  preVisible.value = index - 1 < 0 ? false : true
  nextVisible.value = index + 1 > typeQuestions.length - 1 ? false : true
}

//上一题下一题
const preVisible = ref(true)
const nextVisible = ref(true)
const jumpHandler = async (type: any) => {
  const questions = examStore.getTemporaryQuestions
  const typeQuestions = questions.filter(item => item.questionType === activeItem.value.questionType)
  const index = typeQuestions.findIndex(item => item.id === activeItem.value.id)
  if (type === 1) {
    preVisible.value = index - 2 < 0 ? false : true
    nextVisible.value = true
    activeItem.value = typeQuestions[index - 1]
    changeAnswer()
  }
  if (type === 2) {
    nextVisible.value = index + 2 > typeQuestions.length - 1 ? false : true
    preVisible.value = true
    activeItem.value = typeQuestions[index + 1]
    changeAnswer()
  }
}

const changeAnswer = () => {
  if (activeItem.value.questionType === 1) questionAnswer.value.singleAnswer = activeItem.value.answer
  if (activeItem.value.questionType === 2) questionAnswer.value.multipleAnswer = activeItem.value.answer?.split(',')
  if (activeItem.value.questionType === 3) questionAnswer.value.judgeAnswer = activeItem.value.answer
}

//退出详情页
const routerPushHandler = async () => {
  router.push('/historyExam')
}
</script>

<template>
  <div class="h-full bg-gray-100">
    <div class="mb-[20px] h-[80px] bg-white py-[20px] shadow-md">
      <div class="mx-auto flex w-[90%] items-center justify-between text-[2em]">
        <div class="flex gap-4">
          <img class="h-[32px]" src="@/assets/icons/exam.svg" alt="" />
          <div>{{ examPaper.name }}</div>
        </div>
        <div class="flex gap-16">
          <div><el-button @click="routerPushHandler" size="large" type="danger">退出</el-button></div>
        </div>
      </div>
    </div>
    <div style="height: calc(100vh - 90px)" class="mx-auto grid w-[80%] grid-cols-[1fr_2fr] gap-4">
      <div class="h-full bg-white">
        <div class="relative mt-[10px] scroll-auto px-[5px] [&_.el-icon]:mr-[5px]">
          <div class="sticky top-0 flex justify-between border-b border-solid px-[5px] py-[8px] text-[1.8em]">
            <div>题目总览</div>
            <div>题数</div>
          </div>

          <historyExamOptionItem
            @change-active-item="changeActiveItem"
            :question-list="singleList"
            :active-item="activeItem"
            :question-type="1"
          >
            <template #left>
              <el-icon><Eleme /></el-icon>
              单选题
            </template>
          </historyExamOptionItem>
          <historyExamOptionItem
            @change-active-item="changeActiveItem"
            :question-list="multipleList"
            :active-item="activeItem"
            :question-type="2"
          >
            <template #left>
              <el-icon><ElementPlus /></el-icon>
              多选题
            </template>
          </historyExamOptionItem>
          <historyExamOptionItem
            @change-active-item="changeActiveItem"
            :question-list="judgeList"
            :active-item="activeItem"
            :question-type="3"
          >
            <template #left>
              <el-icon><Finished /></el-icon>
              判断题
            </template>
          </historyExamOptionItem>
        </div>
      </div>

      <div style="height: calc(100vh - 90px)" class="bg-white">
        <div v-if="activeItem.id">
          <div class="flex items-center justify-between p-[20px]">
            <div class="flex items-center gap-3">
              <div class="text-[2em]">{{ activeItem.name }}</div>
              <div class="rounded-xl bg-gray-100 px-[10px] py-[5px] text-[1.2em] text-gray-500">
                分数 {{ activeItem.score }}
              </div>
            </div>
            <div class="flex gap-3 text-[1.2em] text-gray-500">
              <div>作者 {{ activeItem.createdBy }}</div>
              <div>创建时间 {{ activeItem.createdAt?.split('T')[0] }}</div>
            </div>
          </div>
          <div class="px-[20px] pb-[20px] text-[1.5em]">
            {{ activeItem.description }}
          </div>
          <div class="cursor-not-allowed pb-[20px]" v-if="activeItem.questionType === 1">
            <el-radio-group class="block" v-model="questionAnswer.singleAnswer">
              <el-radio value="A">{{ activeItem.optionA }}</el-radio>
              <el-radio value="B">{{ activeItem.optionB }}</el-radio>
              <el-radio value="C">{{ activeItem.optionC }}</el-radio>
              <el-radio value="D">{{ activeItem.optionD }}</el-radio>
            </el-radio-group>
          </div>
          <div class="cursor-default pb-[20px]" v-if="activeItem.questionType === 2">
            <el-checkbox-group v-model="questionAnswer.multipleAnswer">
              <el-checkbox :label="activeItem.optionA" value="A" />
              <el-checkbox :label="activeItem.optionB" value="B" />
              <el-checkbox :label="activeItem.optionC" value="C" />
              <el-checkbox :label="activeItem.optionD" value="D" />
            </el-checkbox-group>
          </div>
          <div class="cursor-default pb-[20px]" v-if="activeItem.questionType === 3">
            <el-radio-group v-model="questionAnswer.judgeAnswer" class="block">
              <el-radio label="正确" value="T" />
              <el-radio label="错误" value="F" />
            </el-radio-group>
          </div>
          <div>
            <div class="mx-auto flex w-[80%] justify-between">
              <el-button
                :class="cn('invisible', preVisible && 'visible')"
                type="primary"
                size="large"
                @click="jumpHandler(1)"
              >
                上一题
              </el-button>
              <el-button
                :class="cn('invisible', nextVisible && 'visible')"
                size="large"
                type="primary"
                @click="jumpHandler(2)"
              >
                下一题
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.el-radio {
  display: block;
  height: auto;
  padding: 20px 40px;
  text-wrap: wrap;
  cursor: not-allowed;
}
:deep(.el-radio__inner) {
  cursor: not-allowed;
}
.el-checkbox {
  display: flex;
  height: auto;
  padding: 20px 40px;
  text-wrap: wrap;
  cursor: not-allowed;

  --el-checkbox-font-size: 16px;
}
:deep(.el-checkbox__inner) {
  cursor: not-allowed;
}
</style>
