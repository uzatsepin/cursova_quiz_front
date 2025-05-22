<template>
  <div v-if="loading" class="text-center py-12">
    <div class="spinner"></div>
    <p class="mt-2 text-sm text-gray-500">Завантаження деталей курсу...</p>
  </div>
  <div v-else-if="error" class="text-center py-12">
    <p class="text-red-600">{{ error }}</p>
  </div>
  <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="bg-white shadow sm:rounded-lg mb-6">
      <div class="px-4 py-5 sm:px-6">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-2">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              {{ course?.title }}
            </h3>
            <span
              v-if="courseStore.isCourseCompleted(course?.id)"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
            >
              <svg
                class="mr-1.5 h-4 w-4 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Завершено
            </span>
          </div>
          <button
            @click="showAddTestModal = true"
            class="btn-primary"
            :disabled="courseStore.isCourseCompleted(course?.id)"
            :class="{
              'opacity-50 cursor-not-allowed': courseStore.isCourseCompleted(course?.id),
            }"
          >
            Додати тест
          </button>
        </div>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
          {{ course?.description }}
        </p>
      </div>
      <div class="border-t border-gray-200">
        <dl>
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Прогрес</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <div class="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div
                  class="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                  :style="{ width: progressPercentage + '%' }"
                ></div>
              </div>
              <div class="flex flex-col space-y-2">
                <span class="text-sm text-gray-600">
                  {{ courseStore.getCompletedTestsCount(course?.id) }} з
                  {{ course?.tests?.length || 0 }} тестів завершено
                </span>
                <div class="flex space-x-4 text-sm text-gray-600">
                  <span> Загальний бал: {{ courseStore.userProgress.totalPoints }} </span>
                  <span>
                    Успішних спроб: {{ courseStore.userProgress.correctAnswers }}
                  </span>
                </div>
              </div>
            </dd>
          </div>
        </dl>
      </div>
    </div>

    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:px-6">
        <h4 class="text-lg font-medium text-gray-900">Тести</h4>
        <div class="mt-4 space-y-4">
          <div
            v-for="test in course?.tests"
            :key="test.id"
            class="border rounded-lg p-4 hover:bg-gray-50"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <h5 class="text-sm font-medium text-gray-900">{{ test.question }}</h5>
                <span
                  v-if="courseStore.isTestCompleted(test.id)"
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  <svg
                    class="mr-1 h-3 w-3 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Пройдено
                </span>
              </div>
              <div class="flex items-center space-x-4">
                <p class="text-sm text-gray-500">{{ test.points }} балів</p>
                <router-link
                  :to="{ name: 'test', params: { id: test.id } }"
                  class="btn-primary text-sm"
                  :class="{
                    'opacity-50 cursor-not-allowed': courseStore.isTestCompleted(test.id),
                  }"
                  v-if="!courseStore.isTestCompleted(test.id)"
                >
                  Пройти тест
                </router-link>
                <span v-else class="text-sm text-green-600 flex items-center">
                  <svg
                    class="mr-1 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  Завершено
                </span>
              </div>
            </div>
            <div
              v-if="courseStore.isTestCompleted(test.id)"
              class="mt-2 text-sm text-gray-500"
            >
              {{
                courseStore.userProgress.attempts.find(
                  (a) => a.testId === test.id && a.isCorrect
                )?.points || 0
              }}
              балів отримано
            </div>
          </div>
          <div v-if="!course?.tests?.length" class="text-center py-8 text-gray-500">
            Поки що немає тестів для цього курсу
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showAddTestModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-lg max-w-lg w-full p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Додати новий тест</h2>
        <form @submit.prevent="handleAddTest">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Питання</label>
              <input
                v-model="newTest.question"
                type="text"
                class="input-field"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Варіанти відповідей</label
              >
              <div class="space-y-2">
                <div
                  v-for="(option, index) in newTest.options"
                  :key="index"
                  class="flex items-center space-x-2"
                >
                  <input
                    v-model="newTest.options[index]"
                    type="text"
                    class="input-field flex-grow"
                    :placeholder="'Варіант ' + (index + 1)"
                    required
                  />
                  <button
                    type="button"
                    @click="removeOption(index)"
                    class="text-red-500 hover:text-red-700"
                    :disabled="newTest.options.length <= 2"
                  >
                    <svg
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
              <button
                type="button"
                @click="addOption"
                class="mt-2 text-sm text-blue-600 hover:text-blue-700"
              >
                + Додати варіант
              </button>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Правильна відповідь</label
              >
              <select v-model="newTest.correctAnswer" class="input-field" required>
                <option
                  v-for="(option, index) in newTest.options"
                  :key="index"
                  :value="index"
                >
                  {{ option }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Кількість балів</label
              >
              <input
                v-model.number="newTest.points"
                type="number"
                min="1"
                class="input-field"
                required
              />
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" class="btn-secondary" @click="showAddTestModal = false">
              Скасувати
            </button>
            <button type="submit" class="btn-primary">Додати тест</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useCourseStore } from "../stores/courses";
import { useToastStore } from "../stores/toast";

const route = useRoute();
const courseStore = useCourseStore();
const toastStore = useToastStore();

const loading = ref(true);
const error = ref("");
const completedTests = ref([]);
const showAddTestModal = ref(false);

const newTest = ref({
  question: "",
  options: ["", ""],
  correctAnswer: 0,
  points: 1,
});

const course = computed(() => {
  return courseStore.availableCourses.find((c) => c.id === parseInt(route.params.id));
});

const progressPercentage = computed(() => {
  if (!course.value?.tests?.length) return 0;
  return Math.round(
    (courseStore.getCompletedTestsCount(course.value.id) / course.value.tests.length) *
      100
  );
});

const isTestCompleted = (testId) => {
  return completedTests.value.includes(testId);
};

const addOption = () => {
  newTest.value.options.push("");
};

const removeOption = (index) => {
  if (newTest.value.options.length > 2) {
    newTest.value.options.splice(index, 1);
    if (newTest.value.correctAnswer >= newTest.value.options.length) {
      newTest.value.correctAnswer = newTest.value.options.length - 1;
    }
  }
};

const handleAddTest = async () => {
  try {
    await courseStore.addTest(course.value.id, newTest.value);
    showAddTestModal.value = false;
    toastStore.success("Тест успішно додано");
    newTest.value = {
      question: "",
      options: ["", ""],
      correctAnswer: 0,
      points: 1,
    };
  } catch (error) {
    toastStore.error(error.message || "Помилка додавання тесту");
  }
};

onMounted(async () => {
  try {
    if (!courseStore.availableCourses.length) {
      await courseStore.fetchCourses();
    }
    await courseStore.fetchCourseTests(parseInt(route.params.id));
    completedTests.value = [];
  } catch (err) {
    error.value = err.toString();
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.input-field {
  @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm;
}

.btn-primary {
  @apply inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500;
}

.btn-secondary {
  @apply inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500;
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
