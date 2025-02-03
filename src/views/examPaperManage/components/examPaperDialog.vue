<!-- @format -->

<script setup lang="ts">
import { ElMessage, FormInstance } from 'element-plus'
import { reactive, ref } from 'vue'

const rules = reactive({
  name: [{ required: true, message: '请输入试卷名称' }],
  duration: [{ required: true, message: '请输入考试时长' }],
  isPublished: [{ required: true, message: '请选择是否发布' }],
})

interface dialogProps {
  title: string
  row: any
  api?: (params: any) => Promise<any>
  getTableList: () => void
}

const dialogFormVisible = ref(false)
const dialogParams = ref<dialogProps>({
  title: '',
  row: {},
  getTableList: () => {},
})

//打开对话框
const acceptParams = (params: any) => {
  dialogFormVisible.value = true
  dialogParams.value = params
}

//提交数据
const ruleFormRef = ref<FormInstance>()
const submitHandler = async () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return
    try {
      if (dialogParams.value.row.createdAt != null)
        dialogParams.value.row.createdAt = dialogParams.value.row.createdAt.split(' ').join('T')

      if (dialogParams.value.row.updatedAt != null)
        dialogParams.value.row.updatedAt = dialogParams.value.row.updatedAt.split(' ').join('T')

      await dialogParams.value.api!(dialogParams.value.row)
      ElMessage.success({ message: `${dialogParams.value.title}用户成功！` })
      dialogParams.value.getTableList!()
      dialogFormVisible.value = false
    } catch (error) {
      console.log(error)
    }
  })
}

defineExpose({
  acceptParams,
})
</script>

<template>
  <div>
    <el-dialog v-model="dialogFormVisible" :title="`${dialogParams.title}试卷`" width="650">
      <el-form ref="ruleFormRef" :rules="rules" label-width="120px" label-suffix=" :" :model="dialogParams.row">
        <el-form-item label="试卷名称" prop="name">
          <el-input v-model="dialogParams.row.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="考试时长" prop="duration">
          <el-input-number v-model="dialogParams.row.duration" :min="0" :max="180" :step="10" />
        </el-form-item>
        <el-form-item label="是否发布" prop="isPublished">
          <el-select v-model="dialogParams.row.isPublished">
            <el-option label="已发布" value="1"></el-option>
            <el-option label="未发布" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" :rows="5" resize="none" v-model="dialogParams.row.description" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="submitHandler">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
