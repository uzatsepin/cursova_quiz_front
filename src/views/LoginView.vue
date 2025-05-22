<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Увійти в свій акаунт
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm flex flex-col gap-4">
          <div>
            <label for="email-address" class="sr-only">Email</label>
            <input
              id="email-address"
              v-model="email"
              name="email"
              type="email"
              required
              class="input-field rounded-t-md"
              placeholder="Email"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Пароль</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              required
              class="input-field rounded-b-md"
              placeholder="Пароль"
            />
          </div>
        </div>

        <div>
          <button type="submit" class="btn-primary w-full">Увійти</button>
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-600">
            Не маєте акаунту?
            <router-link
              to="/register"
              class="font-medium text-blue-600 hover:text-blue-500"
            >
              Створити акаунт тут
            </router-link>
          </p>
        </div>
      </form>

      <div v-if="error" class="mt-4 text-center text-red-600">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useToastStore } from "../stores/toast";

const router = useRouter();
const authStore = useAuthStore();
const toastStore = useToastStore();

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

onMounted(() => {
  // Если пользователь уже авторизован, перенаправляем на страницу курсов
  if (localStorage.getItem("userEmail") && localStorage.getItem("userPassword")) {
    router.push("/courses");
  }
});

const handleSubmit = async () => {
  loading.value = true;
  try {
    error.value = "";
    await authStore.login({ email: email.value, password: password.value });
    router.push("/courses");
  } catch (err) {
    error.value = err.toString();
    toastStore.error(err.message);
  } finally {
    loading.value = false;
  }
};
</script>
