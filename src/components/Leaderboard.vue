<template>
  <div class="max-w-7xl mx-auto">
    <div class="bg-white rounded-2xl shadow-lg p-8">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-4 lg:mb-0">
          Рейтинг користувачів
        </h2>
        <div class="flex space-x-2">
          <button
            class="btn-secondary text-sm"
            :class="{ 'bg-blue-50': period === 'week' }"
            @click="period = 'week'"
          >
            За тиждень
          </button>
          <button
            class="btn-secondary text-sm"
            :class="{ 'bg-blue-50': period === 'month' }"
            @click="period = 'month'"
          >
            За місяць
          </button>
          <button
            class="btn-secondary text-sm"
            :class="{ 'bg-blue-50': period === 'all' }"
            @click="period = 'all'"
          >
            За весь час
          </button>
        </div>
      </div>

      <!-- Top 3 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <!-- Second Place -->
        <div v-if="topUsers[1]" class="relative order-2 md:order-1">
          <div class="stats-card text-center pt-16">
            <div class="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <div
                class="w-20 h-20 rounded-full border-4 border-gray-100 overflow-hidden"
              >
                <img
                  :src="topUsers[1].avatar"
                  :alt="topUsers[1].name"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
            <div class="mt-4">
              <div class="text-xl font-semibold text-gray-900">
                {{ topUsers[1].name }}
              </div>
              <div class="text-lg font-medium text-gray-500">
                {{ topUsers[1].points }} балів
              </div>
            </div>
            <div
              class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3"
            >
              <div class="text-2xl font-bold text-gray-400">2</div>
            </div>
          </div>
        </div>

        <!-- First Place -->
        <div v-if="topUsers[0]" class="relative order-1 md:order-2">
          <div class="stats-card text-center pt-20 border-4 border-yellow-200">
            <div class="absolute -top-8 left-1/2 transform -translate-x-1/2">
              <div
                class="w-24 h-24 rounded-full border-4 border-yellow-200 overflow-hidden"
              >
                <img
                  :src="topUsers[0].avatar"
                  :alt="topUsers[0].name"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
            <div class="mt-4">
              <div class="text-2xl font-bold text-gray-900">{{ topUsers[0].name }}</div>
              <div class="text-xl font-semibold text-yellow-600">
                {{ topUsers[0].points }} балів
              </div>
            </div>
            <div
              class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3"
            >
              <div class="text-3xl font-bold text-yellow-400">1</div>
            </div>
          </div>
        </div>

        <!-- Third Place -->
        <div v-if="topUsers[2]" class="relative order-3">
          <div class="stats-card text-center pt-16">
            <div class="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <div
                class="w-20 h-20 rounded-full border-4 border-gray-100 overflow-hidden"
              >
                <img
                  :src="topUsers[2].avatar"
                  :alt="topUsers[2].name"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
            <div class="mt-4">
              <div class="text-xl font-semibold text-gray-900">
                {{ topUsers[2].name }}
              </div>
              <div class="text-lg font-medium text-gray-500">
                {{ topUsers[2].points }} балів
              </div>
            </div>
            <div
              class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3"
            >
              <div class="text-2xl font-bold text-orange-400">3</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Rest of the leaderboard -->
      <div class="space-y-4">
        <div
          v-for="(user, index) in otherUsers"
          :key="user.id"
          class="flex items-center p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-200 transition-colors"
        >
          <div class="w-12 text-center text-2xl font-bold text-gray-400">
            {{ index + 4 }}
          </div>
          <div class="w-16 h-16 mx-6 rounded-full overflow-hidden">
            <img :src="user.avatar" :alt="user.name" class="w-full h-full object-cover" />
          </div>
          <div class="flex-grow">
            <div class="text-lg font-semibold text-gray-900">{{ user.name }}</div>
            <div class="text-sm text-gray-500">Рівень {{ user.level }}</div>
          </div>
          <div class="flex items-center space-x-8">
            <div class="text-right">
              <div class="text-xl font-bold text-gray-900">{{ user.points }}</div>
              <div class="text-sm text-gray-500">балів</div>
            </div>
            <div v-if="user.trend > 0" class="text-green-500">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div v-else-if="user.trend < 0" class="text-red-500">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  users: {
    type: Array,
    required: true,
  },
});

const period = ref("week");

const topUsers = computed(() => {
  return props.users.slice(0, 3);
});

const otherUsers = computed(() => {
  return props.users.slice(3);
});
</script>
