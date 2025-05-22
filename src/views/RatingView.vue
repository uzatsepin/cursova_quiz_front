<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Рейтинг користувачів
          </h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">
            Ваша позиція: {{ ratingData.currentUserPosition }} з
            {{ ratingData.totalUsers }}
          </p>
        </div>
        <div class="border-t border-gray-200">
          <div v-if="loading" class="text-center py-12">
            <div class="spinner"></div>
            <p class="mt-2 text-sm text-gray-500">Завантаження рейтингу...</p>
          </div>
          <div v-else-if="error" class="text-center py-12">
            <p class="text-red-600">{{ error }}</p>
          </div>
          <div v-else>
            <ul role="list" class="divide-y divide-gray-200">
              <li
                v-for="user in ratingData.top"
                :key="user.id"
                class="px-4 py-4 sm:px-6 hover:bg-gray-50"
                :class="{ 'bg-blue-50': user.isCurrentUser }"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div
                      class="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white font-medium"
                      :class="{
                        'bg-yellow-500': user.position === 1,
                        'bg-gray-400': user.position === 2,
                        'bg-orange-500': user.position === 3,
                        'bg-blue-500': user.position > 3,
                      }"
                    >
                      {{ user.position }}
                    </div>
                    <div class="ml-4">
                      <div class="flex items-center">
                        <div class="text-sm font-medium text-gray-900">
                          {{ user.name }}
                        </div>
                        <div
                          v-if="user.isCurrentUser"
                          class="ml-2 text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full"
                        >
                          Ви
                        </div>
                      </div>
                      <div class="text-sm text-gray-500">
                        Завершено курсів: {{ user.completedCourses }}
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col items-end">
                    <div class="text-sm font-medium text-gray-900">
                      {{ user.score }} балів
                    </div>
                    <div class="text-xs text-gray-500">
                      Точність: {{ Math.round(user.statistics.accuracy) }}% ({{
                        user.statistics.correctAnswers
                      }}/{{ user.statistics.totalAttempts }})
                    </div>
                  </div>
                </div>
              </li>
            </ul>

            <div v-if="ratingData.nearby.length > 0" class="mt-4">
              <div class="px-4 py-3 bg-gray-50 text-sm font-medium text-gray-900">
                Користувачі поруч
              </div>
              <ul role="list" class="divide-y divide-gray-200">
                <li
                  v-for="user in ratingData.nearby"
                  :key="user.id"
                  class="px-4 py-4 sm:px-6 hover:bg-gray-50"
                  :class="{ 'bg-blue-50': user.isCurrentUser }"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <div
                        class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium"
                        :class="{
                          'bg-yellow-500': user.position === 1,
                          'bg-gray-400': user.position === 2,
                          'bg-orange-500': user.position === 3,
                        }"
                      >
                        {{ user.position }}
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{ user.name }}
                        </div>
                        <div
                          v-if="user.isCurrentUser"
                          class="ml-2 text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full"
                        >
                          Ви
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <div class="text-sm text-gray-900">{{ user.score }} балів</div>
                      <div v-if="user.position < 3" class="text-2xl">
                        {{
                          user.position === 1 ? "🏆" : user.position === 2 ? "🥈" : "🥉"
                        }}
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const API_URL = "http://localhost:3000/api";
const loading = ref(true);
const error = ref("");
const ratingData = ref({
  top: [],
  nearby: [],
  currentUserPosition: 0,
  totalUsers: 0,
});

onMounted(async () => {
  try {
    const response = await axios.get(`${API_URL}/rating`, {
      headers: {
        email: localStorage.getItem("userEmail"),
        password: localStorage.getItem("userPassword"),
      },
    });
    ratingData.value = response.data;
  } catch (err) {
    error.value = "Помилка завантаження рейтингу";
    console.error("Rating error:", err);
  } finally {
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
