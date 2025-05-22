<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- Основна статистика -->
    <div class="stats-card">
      <div class="relative">
        <svg class="h-16 w-16 text-blue-100" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path
            d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
          />
          <path
            d="M12 14l-6.16-3.422a12.083 12.083 0 00-.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 016.824-2.998 12.078 12.078 0 00-.665-6.479L12 14z"
          />
        </svg>
        <div class="absolute top-0 right-0">
          <div class="badge badge-success">Рівень {{ level }}</div>
        </div>
      </div>
      <div class="stats-number">{{ totalPoints }}</div>
      <div class="stats-label">Загальна кількість балів</div>
      <div class="mt-4 w-full">
        <div class="text-xs text-gray-500 flex justify-between mb-1">
          <span>До наступного рівня</span>
          <span>{{ pointsToNextLevel }} балів</span>
        </div>
        <div class="progress-bar">
          <div class="progress-bar-fill" :style="{ width: `${levelProgress}%` }" />
        </div>
      </div>
    </div>

    <!-- Статистика тестів -->
    <div class="stats-card">
      <svg class="h-16 w-16 text-green-100" fill="currentColor" viewBox="0 0 20 20">
        <path
          fill-rule="evenodd"
          d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z"
          clip-rule="evenodd"
        />
      </svg>
      <div class="stats-number">{{ completedTests }}</div>
      <div class="stats-label">Завершених тестів</div>
      <div class="mt-2 text-sm text-gray-600">Успішність: {{ successRate }}%</div>
    </div>

    <!-- Досягнення -->
    <div class="stats-card">
      <svg class="h-16 w-16 text-yellow-100" fill="currentColor" viewBox="0 0 20 20">
        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
      </svg>
      <div class="stats-number">{{ unlockedAchievements }}</div>
      <div class="stats-label">Отримано досягнень</div>
      <div class="mt-2 text-sm text-gray-600">із {{ totalAchievements }} можливих</div>
    </div>

    <!-- Активність -->
    <div class="stats-card">
      <svg class="h-16 w-16 text-purple-100" fill="currentColor" viewBox="0 0 20 20">
        <path
          fill-rule="evenodd"
          d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
          clip-rule="evenodd"
        />
      </svg>
      <div class="stats-number">{{ streak }}</div>
      <div class="stats-label">Днів поспіль</div>
      <div class="mt-2 text-sm text-gray-600">
        Найдовша серія: {{ longestStreak }} днів
      </div>
    </div>
  </div>

  <!-- Останні досягнення -->
  <div class="mt-8">
    <h3 class="section-title">Останні досягнення</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="achievement in recentAchievements"
        :key="achievement.id"
        class="achievement-card"
      >
        <div
          class="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center"
        >
          <component :is="achievement.icon" class="h-6 w-6 text-yellow-600" />
        </div>
        <div class="flex-grow">
          <h4 class="font-semibold text-gray-900">{{ achievement.title }}</h4>
          <p class="text-sm text-gray-600">{{ achievement.description }}</p>
        </div>
        <div class="text-sm text-gray-500">
          {{ formatDate(achievement.unlockedAt) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  level: {
    type: Number,
    required: true,
  },
  totalPoints: {
    type: Number,
    required: true,
  },
  pointsToNextLevel: {
    type: Number,
    required: true,
  },
  completedTests: {
    type: Number,
    required: true,
  },
  successRate: {
    type: Number,
    required: true,
  },
  unlockedAchievements: {
    type: Number,
    required: true,
  },
  totalAchievements: {
    type: Number,
    required: true,
  },
  streak: {
    type: Number,
    required: true,
  },
  longestStreak: {
    type: Number,
    required: true,
  },
  recentAchievements: {
    type: Array,
    required: true,
  },
});

const levelProgress = computed(() => {
  const pointsPerLevel = 1000; // Припустимо, що для кожного рівня потрібно 1000 балів
  return 100 - (props.pointsToNextLevel / pointsPerLevel) * 100;
});

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
  });
};
</script>
