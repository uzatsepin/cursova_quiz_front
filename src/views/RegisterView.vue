<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Створити акаунт
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm flex flex-col gap-4">
          <div>
            <label for="name" class="sr-only">Ім'я</label>
            <input
              id="name"
              v-model="name"
              name="name"
              type="text"
              required
              class="input-field rounded-t-md"
              placeholder="Ім'я"
            />
          </div>
          <div>
            <label for="email-address" class="sr-only">Email</label>
            <input
              id="email-address"
              v-model="email"
              name="email"
              type="email"
              required
              class="input-field"
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
              class="input-field"
              placeholder="Пароль"
            />
          </div>
          <div>
            <label for="confirm-password" class="sr-only">Підтвердити пароль</label>
            <input
              id="confirm-password"
              v-model="confirmPassword"
              name="confirm-password"
              type="password"
              required
              class="input-field rounded-b-md"
              placeholder="Підтвердити пароль"
            />
          </div>
        </div>

        <div>
          <button type="submit" class="btn-primary w-full">Створити акаунт</button>
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-600">
            Маєте акаунт?
            <router-link
              to="/login"
              class="font-medium text-blue-600 hover:text-blue-500"
            >
              Увійти тут
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const error = ref("");

const handleSubmit = async () => {
  try {
    error.value = "";

    if (password.value !== confirmPassword.value) {
      error.value = "Passwords do not match";
      return;
    }

    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
    });
    router.push("/courses");
  } catch (err) {
    error.value = err.toString();
  }
};
</script>
