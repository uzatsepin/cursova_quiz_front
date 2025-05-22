<template>
  <div class="quiz-question">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-4">
        <span class="text-lg font-medium text-gray-500"
          >Питання {{ currentNumber }} з {{ totalQuestions }}</span
        >
        <div class="progress-bar w-48">
          <div
            class="progress-bar-fill"
            :style="{ width: `${(currentNumber / totalQuestions) * 100}%` }"
          />
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <svg class="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
        <span class="font-medium text-gray-700">+{{ points }} балів</span>
      </div>
    </div>

    <div class="card mb-8">
      <h3 class="text-xl font-semibold text-gray-900 mb-4">{{ question }}</h3>

      <div class="space-y-3">
        <template v-if="type === 'single'">
          <label
            v-for="(option, index) in options"
            :key="index"
            class="flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200"
            :class="[
              selectedOption === index
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300',
              { 'pointer-events-none': isAnswered },
            ]"
          >
            <input
              type="radio"
              :value="index"
              v-model="selectedOption"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500"
              :disabled="isAnswered"
            />
            <span class="ml-3" :class="{ 'font-medium': selectedOption === index }">{{
              option
            }}</span>
            <div v-if="isAnswered" class="ml-auto flex items-center">
              <template v-if="index === correctAnswer">
                <svg
                  class="h-5 w-5 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </template>
              <template v-else-if="selectedOption === index">
                <svg
                  class="h-5 w-5 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </template>
            </div>
          </label>
        </template>

        <template v-else-if="type === 'multiple'">
          <label
            v-for="(option, index) in options"
            :key="index"
            class="flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200"
            :class="[
              selectedOptions.includes(index)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300',
              { 'pointer-events-none': isAnswered },
            ]"
          >
            <input
              type="checkbox"
              :value="index"
              v-model="selectedOptions"
              class="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              :disabled="isAnswered"
            />
            <span
              class="ml-3"
              :class="{ 'font-medium': selectedOptions.includes(index) }"
              >{{ option }}</span
            >
            <div v-if="isAnswered" class="ml-auto flex items-center">
              <template v-if="correctAnswers.includes(index)">
                <svg
                  class="h-5 w-5 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </template>
              <template v-else-if="selectedOptions.includes(index)">
                <svg
                  class="h-5 w-5 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </template>
            </div>
          </label>
        </template>
      </div>

      <div
        v-if="isAnswered"
        class="mt-6 p-4 rounded-lg"
        :class="isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'"
      >
        <div class="flex items-center">
          <svg
            v-if="isCorrect"
            class="h-5 w-5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
          <svg v-else class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="font-medium">{{ isCorrect ? "Правильно!" : "Неправильно." }}</span>
        </div>
        <p class="mt-2">{{ explanation }}</p>
      </div>
    </div>

    <div class="flex justify-between">
      <button
        @click="$emit('previous')"
        class="btn-secondary"
        :disabled="currentNumber === 1"
      >
        Попереднє
      </button>
      <button
        v-if="!isAnswered"
        @click="checkAnswer"
        class="btn-primary"
        :disabled="!canSubmit"
      >
        Відповісти
      </button>
      <button
        v-else
        @click="$emit('next')"
        class="btn-primary"
        :disabled="currentNumber === totalQuestions"
      >
        Наступне
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  currentNumber: {
    type: Number,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    validator: (value) => ["single", "multiple"].includes(value),
  },
  options: {
    type: Array,
    required: true,
  },
  correctAnswer: {
    type: Number,
    default: undefined,
  },
  correctAnswers: {
    type: Array,
    default: () => [],
  },
  points: {
    type: Number,
    default: 10,
  },
  explanation: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["answer", "previous", "next"]);

const selectedOption = ref(null);
const selectedOptions = ref([]);
const isAnswered = ref(false);
const isCorrect = ref(false);

const canSubmit = computed(() => {
  if (props.type === "single") {
    return selectedOption.value !== null;
  } else {
    return selectedOptions.value.length > 0;
  }
});

const checkAnswer = () => {
  if (props.type === "single") {
    isCorrect.value = selectedOption.value === props.correctAnswer;
  } else {
    const selected = new Set(selectedOptions.value);
    const correct = new Set(props.correctAnswers);
    isCorrect.value =
      selected.size === correct.size &&
      [...selected].every((value) => correct.has(value));
  }
  isAnswered.value = true;
  emit("answer", {
    isCorrect: isCorrect.value,
    points: isCorrect.value ? props.points : 0,
    selectedAnswer:
      props.type === "single" ? selectedOption.value : selectedOptions.value,
  });
};
</script>
