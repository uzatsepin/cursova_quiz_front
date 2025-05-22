<template>
  <div v-if="loading" class="text-center py-12">
    <div class="spinner"></div>
    <p class="mt-2 text-sm text-gray-500">Завантаження тесту...</p>
  </div>
  <div v-else-if="error" class="text-center py-12">
    <p class="text-red-600">{{ error }}</p>
  </div>
  <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="bg-white shadow sm:rounded-lg">
      <!-- Форма теста -->
      <div v-if="!submitted" class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
          {{ test?.question }}
        </h3>
        <div class="space-y-4">
          <div v-for="(option, index) in test?.options" :key="index">
            <label class="flex items-center space-x-3">
              <input
                type="radio"
                :value="index"
                v-model="selectedAnswer"
                class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
              />
              <span class="text-gray-700">{{ option }}</span>
            </label>
          </div>
        </div>
        <div class="mt-6">
          <button
            @click="submitAnswer"
            class="btn-primary"
            :disabled="selectedAnswer === null"
          >
            Відправити відповідь
          </button>
        </div>
      </div>

      <!-- Результат -->
      <div v-else class="px-4 py-5 sm:p-6">
        <div
          class="rounded-md p-4"
          :class="{
            'bg-green-50': result?.correct,
            'bg-red-50': !result?.correct,
          }"
        >
          <div class="flex">
            <div class="flex-shrink-0">
              <svg
                v-if="result?.correct"
                class="h-5 w-5 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg
                v-else
                class="h-5 w-5 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <h3
                class="text-sm font-medium"
                :class="{
                  'text-green-800': result?.correct,
                  'text-red-800': !result?.correct,
                }"
              >
                {{ result?.correct ? "Правильно!" : "Неправильно" }}
              </h3>
              <div
                class="mt-2 text-sm"
                :class="{
                  'text-green-700': result?.correct,
                  'text-red-700': !result?.correct,
                }"
              >
                <p>
                  {{
                    result?.correct
                      ? `Ви отримали ${result.points} балів!`
                      : "Спробуйте ще раз."
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6">
          <router-link :to="'/courses/' + courseId" class="btn-primary">
            Повернутися до курсу
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCourseStore } from "../stores/courses";
import { useToastStore } from "../stores/toast";

const route = useRoute();
const router = useRouter();
const courseStore = useCourseStore();
const toastStore = useToastStore();

const loading = ref(true);
const error = ref("");
const test = ref(null);
const selectedAnswer = ref(null);
const submitted = ref(false);
const result = ref(null);
const courseId = ref(null);

onMounted(async () => {
  try {
    const testId = parseInt(route.params.id);

    // Если курсы еще не загружены, загружаем их
    if (!courseStore.availableCourses.length) {
      await courseStore.fetchCourses();
    }

    // Ищем тест в курсах
    for (const course of courseStore.availableCourses) {
      // Если тесты курса еще не загружены, загружаем их
      if (!course.tests) {
        await courseStore.fetchCourseTests(course.id);
      }

      const foundTest = course.tests?.find((t) => t.id === testId);
      if (foundTest) {
        test.value = foundTest;
        courseId.value = course.id;
        break;
      }
    }

    if (!test.value) {
      throw new Error("Тест не знайдено");
    }
  } catch (err) {
    error.value = err.message;
    toastStore.error(err.message);
  } finally {
    loading.value = false;
  }
});

const submitAnswer = async () => {
  if (selectedAnswer.value === null) return;

  try {
    const response = await courseStore.submitTestAnswer(
      test.value.id,
      selectedAnswer.value
    );
    result.value = response;
    submitted.value = true;

    // Обновляем прогресс сразу после получения ответа
    await courseStore.fetchUserProgress();

    if (response.correct) {
      toastStore.success(`Вітаємо! Ви отримали ${response.points} балів!`);
      if (response.courseCompleted) {
        toastStore.success("Вітаємо! Ви успішно завершили курс!");
        // Даем время увидеть результат и уведомления
        setTimeout(() => {
          router.push(`/courses/${courseId.value}`);
        }, 2000);
      }
    } else {
      toastStore.error("На жаль, відповідь неправильна. Спробуйте ще раз.");
    }
  } catch (err) {
    if (err.response?.data?.error === "Ви вже успішно пройшли цей тест") {
      submitted.value = true;
      result.value = { correct: true, points: test.value.points };
      toastStore.info("Ви вже успішно пройшли цей тест");
      // Обновляем прогресс даже в случае повторного прохождения
      await courseStore.fetchUserProgress();
    } else {
      error.value = err.message;
      toastStore.error(err.message);
    }
  }
};
</script>

<style scoped>
.btn-primary {
  @apply inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #3b82f6;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
