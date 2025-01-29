<!-- @format -->

<script setup lang="ts">
import { PropType } from 'vue'

const props = defineProps({
  row: {
    required: true,
    type: Object as PropType<any>,
  },
})
</script>

<template>
  <div>
    <el-form-item label="正确答案" prop="answer">
      <el-radio-group v-model="props.row.answer">
        <el-radio label="T" value="T"></el-radio>
        <el-radio label="F" value="F"></el-radio>
      </el-radio-group>
    </el-form-item>
  </div>
</template>
