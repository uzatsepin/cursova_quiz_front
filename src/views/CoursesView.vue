<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4 lg:mb-0">Мої курси</h1>
      <div class="flex space-x-4">
        <button class="btn-primary" @click="showAddCourseModal = true">
          Додати курс
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="courseStore.loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error state -->
    <div
      v-else-if="courseStore.error"
      class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
    >
      <p class="text-red-600">{{ courseStore.error }}</p>
    </div>

    <!-- Courses grid -->
    <div v-else class="courses-grid">
      <div
        v-for="course in courseStore.courses"
        :key="course.id"
        class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-semibold text-gray-900">{{ course.title }}</h3>
            <span
              class="px-3 py-1 rounded-full text-sm font-medium"
              :class="getDifficultyClass(course.difficulty)"
            >
              {{ getDifficultyText(course.difficulty) }}
            </span>
          </div>
          <p class="text-gray-600 mb-4">{{ course.description }}</p>
          <div class="flex items-center justify-between">
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
                <span class="ml-1 text-sm text-gray-500">{{ course.duration }} хв.</span>
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
                <span class="ml-1 text-sm text-gray-500"
                  >{{ course.tests?.length || 0 }} тестів</span
                >
              </div>
            </div>
            <router-link :to="'/courses/' + course.id" class="btn-primary text-sm">
              Почати
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Course Modal -->
    <div
      v-if="showAddCourseModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-lg max-w-lg w-full p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Додати новий курс</h2>
        <form @submit.prevent="handleAddCourse">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Назва курсу</label
              >
              <input v-model="newCourse.title" type="text" class="input-field" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Опис</label>
              <textarea
                v-model="newCourse.description"
                class="input-field"
                rows="3"
                required
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Складність</label
              >
              <select v-model="newCourse.difficulty" class="input-field" required>
                <option value="1">Початковий</option>
                <option value="2">Легкий</option>
                <option value="3">Середній</option>
                <option value="4">Складний</option>
                <option value="5">Експертний</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Тривалість (хв)</label
              >
              <input
                v-model.number="newCourse.duration"
                type="number"
                min="1"
                class="input-field"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Порядковий номер</label
              >
              <input
                v-model.number="newCourse.orderNumber"
                type="number"
                min="1"
                class="input-field"
                required
              />
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              class="btn-secondary"
              @click="showAddCourseModal = false"
            >
              Скасувати
            </button>
            <button type="submit" class="btn-primary">Додати курс</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useCourseStore } from "@/stores/courses";
import { useToastStore } from "@/stores/toast";

const courseStore = useCourseStore();
const toastStore = useToastStore();

const showAddCourseModal = ref(false);
const newCourse = ref({
  title: "",
  description: "",
  difficulty: "1",
  duration: 30,
  orderNumber: 1,
});

onMounted(async () => {
  try {
    await courseStore.fetchCourses();
  } catch (error) {
    toastStore.error("Помилка завантаження курсів");
  }
});

const getDifficultyClass = (difficulty) => {
  const classes = {
    1: "bg-green-100 text-green-800",
    2: "bg-blue-100 text-blue-800",
    3: "bg-yellow-100 text-yellow-800",
    4: "bg-orange-100 text-orange-800",
    5: "bg-red-100 text-red-800",
  };
  return classes[difficulty] || classes[1];
};

const getDifficultyText = (difficulty) => {
  const texts = {
    1: "Початковий",
    2: "Легкий",
    3: "Середній",
    4: "Складний",
    5: "Експертний",
  };
  return texts[difficulty] || texts[1];
};

const handleAddCourse = async () => {
  try {
    await courseStore.addCourse(newCourse.value);
    showAddCourseModal.value = false;
    toastStore.success("Курс успішно додано");
    newCourse.value = {
      title: "",
      description: "",
      difficulty: "1",
      duration: 30,
      orderNumber: 1,
    };
  } catch (error) {
    toastStore.error("Помилка додавання курсу");
  }
};
</script>

<style scoped>
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
