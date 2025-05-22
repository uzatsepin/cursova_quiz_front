<template>
  <div class="bg-white shadow sm:rounded-lg max-w-7xl mx-auto mt-6">
    <div class="px-4 py-5 sm:px-6">
      <h3 class="text-lg leading-6 font-medium text-gray-900">Профіль користувача</h3>
      <p class="mt-1 max-w-2xl text-sm text-gray-500">Особиста інформація та прогрес</p>
    </div>
    <div class="border-t border-gray-200">
      <dl>
        <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Ім'я</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {{ authStore.user?.name }}
          </dd>
        </div>
        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Email</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {{ authStore.user?.email }}
          </dd>
        </div>
        <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Загальний бал</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {{ courseStore.userProgress?.totalPoints || 0 }} балів
          </dd>
        </div>
        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Поточний рівень</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {{ Math.floor((courseStore.userProgress?.totalPoints || 0) / 100) + 1 }}
          </dd>
        </div>
        <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Завершені курси</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            <div v-if="loading" class="text-center py-4">
              <div class="spinner"></div>
              <p class="mt-2 text-sm text-gray-500">Завантаження...</p>
            </div>
            <ul
              v-else
              role="list"
              class="border border-gray-200 rounded-md divide-y divide-gray-200"
            >
              <li
                v-for="course in completedCourses"
                :key="course.id"
                class="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
              >
                <div class="w-0 flex-1 flex items-center">
                  <svg
                    class="flex-shrink-0 h-5 w-5 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span class="ml-2 flex-1 w-0">{{ course.name }}</span>
                </div>
                <div class="ml-4 flex-shrink-0">
                  <router-link
                    :to="{ name: 'course-detail', params: { id: course.id } }"
                    class="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Переглянути
                  </router-link>
                </div>
              </li>
              <li
                v-if="completedCourses.length === 0"
                class="pl-3 pr-4 py-3 text-sm text-gray-500"
              >
                Ще немає завершених курсів
              </li>
            </ul>
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import { useCourseStore } from "../stores/courses";

const authStore = useAuthStore();
const courseStore = useCourseStore();
const loading = ref(true);
const completedCourses = ref([]);

onMounted(async () => {
  try {
    await courseStore.fetchUserProgress();
    // Здесь мы можем добавить загрузку завершенных курсов, если такой API есть
    loading.value = false;
  } catch (error) {
    console.error("Помилка завантаження прогресу:", error);
    loading.value = false;
  }
});
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
