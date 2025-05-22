<template>
  <div class="achievement-card" :class="{ 'opacity-50': !achieved }">
    <div class="flex-shrink-0">
      <div class="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
        <component :is="icon" class="h-6 w-6 text-yellow-600" />
      </div>
    </div>
    <div class="flex-grow">
      <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
      <p class="text-sm text-gray-600">{{ description }}</p>
      <div v-if="progress !== undefined" class="mt-2">
        <div class="progress-bar">
          <div class="progress-bar-fill" :style="{ width: `${progressPercentage}%` }" />
        </div>
        <div class="flex justify-between text-xs text-gray-500 mt-1">
          <span>{{ progress }} / {{ total }}</span>
          <span>{{ progressPercentage }}%</span>
        </div>
      </div>
    </div>
    <div class="flex-shrink-0 ml-4">
      <div v-if="achieved" class="badge badge-success">Отримано</div>
      <div v-else class="badge badge-progress">У процесі</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: Object,
    required: true,
  },
  achieved: {
    type: Boolean,
    default: false,
  },
  progress: {
    type: Number,
    default: undefined,
  },
  total: {
    type: Number,
    default: undefined,
  },
});

const progressPercentage = computed(() => {
  if (props.progress === undefined || props.total === undefined) return 0;
  return Math.round((props.progress / props.total) * 100);
});
</script>
