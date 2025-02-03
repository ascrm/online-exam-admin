<!-- @format -->

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Finished } from '@element-plus/icons-vue'
import { getQuestionsByExamPaperIdAndQuestionTypeApi, getQuestionViewerByIdApi } from '@/api/modules/question'
import examOptionItem from './components/examOptionItem.vue'

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

const activeIndex = ref(1)
const activeQuestionType = ref(1)
const examPaper = ref<Partial<ExamPaperProp>>({})
onMounted(async () => {
  examPaper.value = JSON.parse(localStorage.getItem('examPaper') as unknown as string)
  await getQuestionsByExamPaperIdAndQuestionType()
})

//根据试卷id和题目类别查询当前试卷下的所有题目（包括相信信息）
const questionViewerList = ref<QuestionProp[]>([])
const getQuestionsByExamPaperIdAndQuestionType = async () => {
  const { data } = await getQuestionsByExamPaperIdAndQuestionTypeApi({
    examPaperId: examPaper.value.id,
    questionType: activeQuestionType.value,
  })
  questionViewerList.value = data as unknown as any
}

//切换activeItem
const activeItemId = ref(0)
const questionViewer = ref<Partial<QuestionProp>>({})
const changeActiveItem = (data: any, id: any) => {
  activeItemId.value = id
  questionViewer.value = data
}

const historyExamQuestion = ref({
  answer: '',
})
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
          <div>考试时间：{{ examPaper.duration }}</div>
          <div><el-button type="primary">提交试卷</el-button></div>
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
          <examOptionItem @change-active-item="changeActiveItem" :active-item-id="activeItemId" :question-type="1">
            <template #left>
              <el-icon><Eleme /></el-icon>
              单选题
            </template>
          </examOptionItem>
          <examOptionItem @change-active-item="changeActiveItem" :active-item-id="activeItemId" :question-type="2">
            <template #left>
              <el-icon><ElementPlus /></el-icon>
              多选题
            </template>
          </examOptionItem>
          <examOptionItem @change-active-item="changeActiveItem" :active-item-id="activeItemId" :question-type="3">
            <template #left>
              <el-icon><Finished /></el-icon>
              判断题
            </template>
          </examOptionItem>
        </div>
      </div>

      <div style="height: calc(100vh - 90px)" class="bg-white">
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
            <el-radio-group v-model="historyExamQuestion.answer" class="block">
              <el-radio value="A">{{ questionViewer.optionA }}</el-radio>
              <el-radio value="B">{{ questionViewer.optionB }}</el-radio>
              <el-radio value="C">{{ questionViewer.optionC }}</el-radio>
              <el-radio value="D">{{ questionViewer.optionD }}</el-radio>
            </el-radio-group>
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
  padding: 10px 20px;
  text-wrap: wrap;
}
</style>
