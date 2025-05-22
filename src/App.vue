<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useToastStore } from "@/stores/toast";
import AppHeader from "@/components/AppHeader.vue";

const authStore = useAuthStore();
const toastStore = useToastStore();

onMounted(async () => {
  try {
    await authStore.checkAuth();
  } catch (error) {
    console.error("Error checking auth:", error);
  }
});

const mobileMenuOpen = ref(false);
const showProfileMenu = ref(false);

const isAuthenticated = computed(() => authStore.isAuthenticated);
const userName = computed(() => authStore.user?.name || "");
const userPoints = computed(() => authStore.user?.points || 0);
const userLevel = computed(() => authStore.user?.level || 1);
const userAvatar = computed(() => authStore.user?.avatar || "/default-avatar.png");
const toasts = computed(() => toastStore.toasts);

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value;
};

const logout = async () => {
  await authStore.logout();
  showProfileMenu.value = false;
};

const toastClasses = (type) => ({
  "bg-green-500 text-white": type === "success",
  "bg-red-500 text-white": type === "error",
  "bg-blue-500 text-white": type === "info",
  "bg-yellow-500 text-white": type === "warning",
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
    <AppHeader />

    <!-- Основной контент -->
    <main class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Уведомления -->
    <div class="fixed bottom-4 right-4 z-50">
      <transition-group name="list">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="mb-2 p-4 rounded-lg shadow-lg max-w-md"
          :class="toastClasses(toast.type)"
        >
          {{ toast.message }}
        </div>
      </transition-group>
    </div>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.stats-mini {
  @apply flex items-center bg-gray-50 px-3 py-1 rounded-full text-sm;
}
</style>
