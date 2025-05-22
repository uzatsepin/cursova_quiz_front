<template>
  <div class="quiz-card group">
    <div class="flex items-start space-x-4">
      <div class="flex-shrink-0">
        <div
          class="h-16 w-16 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center"
        >
          <component :is="icon" class="h-8 w-8 text-white" />
        </div>
      </div>
      <div class="flex-grow">
        <div class="flex items-center justify-between">
          <h3
            class="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors"
          >
            {{ title }}
          </h3>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">Складність:</span>
            <div class="flex">
              <div
                v-for="n in 5"
                :key="n"
                class="w-2 h-2 rounded-full mx-0.5"
                :class="n <= difficulty ? 'bg-blue-500' : 'bg-gray-200'"
              ></div>
            </div>
          </div>
        </div>
        <p class="mt-1 text-gray-600">{{ description }}</p>
        <div class="mt-4 flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="flex items-center">
              <svg
                class="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span class="ml-1 text-sm text-gray-500">{{ duration }} хв.</span>
            </div>
            <div class="flex items-center">
              <svg
                class="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <span class="ml-1 text-sm text-gray-500">{{ questionsCount }} питань</span>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <div v-if="reward" class="flex items-center text-yellow-600">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L10 6.477 6.271 7.583l1.714 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L5 10.274zm10 0l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L15 10.274z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="ml-1 text-sm font-medium">+{{ reward }} балів</span>
            </div>
            <div v-if="progress !== undefined" class="flex items-center">
              <div class="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  class="h-full bg-green-500"
                  :style="{ width: `${progressPercentage}%` }"
                />
              </div>
              <span class="ml-2 text-sm text-gray-500">{{ progressPercentage }}%</span>
            </div>
          </div>
        </div>
      </div>
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
  difficulty: {
    type: Number,
    default: 1,
    validator: (value) => value >= 1 && value <= 5,
  },
  duration: {
    type: Number,
    required: true,
  },
  questionsCount: {
    type: Number,
    required: true,
  },
  reward: {
    type: Number,
    default: 0,
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
