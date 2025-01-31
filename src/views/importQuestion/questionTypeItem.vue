<!-- @format -->

<template>
  <div class="flex cursor-pointer items-center justify-between rounded-md px-[5px] py-[3px]">
    <div class="flex items-center text-[1.5em]">
      <slot name="left"></slot>
    </div>
    <div class="text-[1.5em]">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
