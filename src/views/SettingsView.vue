<template>
  <div class="bg-white shadow sm:rounded-lg">
    <div class="px-4 py-5 sm:px-6">
      <h3 class="text-lg leading-6 font-medium text-gray-900">User Settings</h3>
      <p class="mt-1 max-w-2xl text-sm text-gray-500">
        Customize your learning experience
      </p>
    </div>
    <div class="border-t border-gray-200">
      <div class="px-4 py-5 sm:p-6">
        <div class="space-y-6">
          <div>
            <label for="font-size" class="block text-sm font-medium text-gray-700">
              Font Size
            </label>
            <div class="mt-1">
              <select
                id="font-size"
                v-model="settings.fontSize"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="12">Small (12px)</option>
                <option value="14">Medium (14px)</option>
                <option value="16">Large (16px)</option>
                <option value="18">Extra Large (18px)</option>
              </select>
            </div>
          </div>

          <div>
            <label for="theme" class="block text-sm font-medium text-gray-700"
              >Theme</label
            >
            <div class="mt-1">
              <select
                id="theme"
                v-model="settings.theme"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>

          <div>
            <label for="language" class="block text-sm font-medium text-gray-700"
              >Language</label
            >
            <div class="mt-1">
              <select
                id="language"
                v-model="settings.language"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="uk">Ukrainian</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end">
            <button type="button" class="btn-secondary mr-3" @click="resetSettings">
              Reset to Defaults
            </button>
            <button
              type="button"
              class="btn-primary"
              @click="saveSettings"
              :disabled="!hasChanges"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="notification.show"
      class="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4"
      :class="{
        'border-green-500': notification.type === 'success',
        'border-red-500': notification.type === 'error',
      }"
    >
      <div class="flex items-center">
        <svg
          v-if="notification.type === 'success'"
          class="h-6 w-6 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <svg
          v-else
          class="h-6 w-6 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <span
          class="ml-2"
          :class="{
            'text-green-600': notification.type === 'success',
            'text-red-600': notification.type === 'error',
          }"
        >
          {{ notification.message }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();

const defaultSettings = {
  fontSize: 16,
  theme: "light",
  language: "uk",
};

const settings = ref({ ...defaultSettings });
const originalSettings = ref({ ...defaultSettings });
const notification = ref({
  show: false,
  type: "success",
  message: "",
});

const hasChanges = computed(() => {
  return (
    settings.value.fontSize !== originalSettings.value.fontSize ||
    settings.value.theme !== originalSettings.value.theme ||
    settings.value.language !== originalSettings.value.language
  );
});

const showNotification = (type, message) => {
  notification.value = {
    show: true,
    type,
    message,
  };
  setTimeout(() => {
    notification.value.show = false;
  }, 3000);
};

const resetSettings = () => {
  settings.value = { ...defaultSettings };
  showNotification("success", "Settings reset to defaults");
};

const saveSettings = async () => {
  try {
    await authStore.updateSettings(settings.value);
    originalSettings.value = { ...settings.value };
    showNotification("success", "Settings saved successfully");
  } catch (error) {
    showNotification("error", error.toString());
  }
};

onMounted(() => {
  const userSettings = authStore.getUserSettings;
  if (userSettings) {
    settings.value = { ...userSettings };
    originalSettings.value = { ...userSettings };
  }
});
</script>
