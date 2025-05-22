<template>
  <nav class="bg-white shadow-md">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Логотип и основная навигация -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center">
            <span class="text-xl font-bold text-gray-900">Курсова робота</span>
          </router-link>
          <div class="hidden md:flex items-center ml-10 space-x-8">
            <router-link
              to="/courses"
              class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150"
            >
              Курси
            </router-link>
            <router-link
              to="/rating"
              class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150"
            >
              Рейтинг
            </router-link>
          </div>
        </div>

        <!-- Правая часть навигации -->
        <div class="flex items-center" v-if="authStore.isAuthenticated">
          <div class="hidden md:flex items-center space-x-6 mr-4">
            <div class="flex items-center space-x-1 text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-yellow-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
              <span class="font-medium">{{
                courseStore.userProgress?.totalPoints || 0
              }}</span>
            </div>
            <div class="flex items-center space-x-1 text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-blue-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                />
              </svg>
              <span class="font-medium"
                >Рівень
                {{
                  Math.floor((courseStore.userProgress?.totalPoints || 0) / 100) + 1
                }}</span
              >
            </div>
          </div>

          <div class="relative">
            <button
              @click="showDropdown = !showDropdown"
              class="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              id="user-menu"
              aria-expanded="false"
              aria-haspopup="true"
            >
              <span class="sr-only">Відкрити меню користувача</span>
              <div
                class="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium transition duration-150 hover:bg-blue-700"
              >
                {{ authStore.user?.name?.[0]?.toUpperCase() || "U" }}
              </div>
            </button>

            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div
                v-if="showDropdown"
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu"
              >
                <router-link
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition duration-150"
                  role="menuitem"
                  @click="showDropdown = false"
                >
                  Профіль
                </router-link>
                <router-link
                  to="/rating"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition duration-150"
                  role="menuitem"
                  @click="showDropdown = false"
                >
                  Рейтинг
                </router-link>
                <button
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition duration-150"
                  role="menuitem"
                  @click="handleLogout"
                >
                  Вийти
                </button>
              </div>
            </transition>
          </div>
        </div>

        <div class="flex items-center space-x-4" v-else>
          <router-link
            to="/login"
            class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150"
          >
            Увійти
          </router-link>
          <router-link
            to="/register"
            class="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition duration-150 shadow-sm"
          >
            Зареєструватися
          </router-link>
        </div>
      </div>
    </div>

    <!-- Мобильное меню -->
    <div class="md:hidden" v-show="mobileMenuOpen">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <router-link
          to="/courses"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition duration-150"
          >Курси</router-link
        >
        <router-link
          to="/rating"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition duration-150"
          >Рейтинг</router-link
        >
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useCourseStore } from "../stores/courses";

const router = useRouter();
const authStore = useAuthStore();
const courseStore = useCourseStore();
const showDropdown = ref(false);
const mobileMenuOpen = ref(false);

// Закрываем дропдаун при клике вне его
const handleClickOutside = (event) => {
  const menu = document.getElementById("user-menu");
  if (menu && !menu.contains(event.target)) {
    showDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  if (authStore.isAuthenticated) {
    courseStore.fetchUserProgress();
  }
});

const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};
</script>
