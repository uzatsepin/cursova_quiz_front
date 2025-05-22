<script setup>
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h1
          class="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl"
        >
          Система тестування знань
        </h1>
        <p class="mt-5 max-w-xl mx-auto text-xl text-gray-500">
          Курсова робота Зацепіна Андрія
        </p>
      </div>

      <div class="mt-16">
        <div class="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
          <div class="px-4 py-5 sm:px-6">
            <h2 class="text-lg font-medium text-gray-900">Про проект</h2>
          </div>
          <div class="px-4 py-5 sm:p-6">
            <div class="space-y-4">
              <p class="text-base text-gray-500">
                Система розроблена для проведення тестування знань студентів. Вона
                дозволяє:
              </p>
              <ul class="list-disc list-inside space-y-2 text-gray-500">
                <li>Проходити тести з різних курсів</li>
                <li>Відстежувати свій прогрес</li>
                <li>Отримувати бали за правильні відповіді</li>
                <li>Змагатися з іншими студентами в рейтингу</li>
              </ul>
            </div>
          </div>
          <div class="px-4 py-4 sm:px-6">
            <div class="flex justify-center space-x-4">
              <router-link
                v-if="!authStore.isAuthenticated"
                to="/register"
                class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Розпочати
              </router-link>
              <router-link
                v-else
                to="/courses"
                class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Перейти до курсів
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
