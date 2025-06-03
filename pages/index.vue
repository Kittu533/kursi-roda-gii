<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold">Masuk</h1>
      </div>

      <!-- Form error message -->
      <div
        v-if="formError"
        class="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm"
      >
        {{ formError }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Username Field -->
        <div>
          <label
            for="username"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Username
          </label>
          <div class="relative">
            <input
              id="username"
              v-model="login.username"
              type="text"
              class="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 border-gray-300"
            />
          </div>
        </div>

        <!-- Password Field -->
        <div>
          <label
            for="password"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="login.password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              :class="[
                'appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 pr-10',
                passwordError ? 'border-red-300' : 'border-gray-300',
              ]"
            />
            <button
              type="button"
              @click="togglePasswordVisibility"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
            >
              <EyeIcon v-if="!showPassword" class="h-5 w-5" />
              <EyeOffIcon v-else class="h-5 w-5" />
            </button>
          </div>
          <p v-if="passwordError" class="mt-1 text-sm text-red-600">
            {{ passwordError }}
          </p>
        </div>

        <!-- Sign In Button -->
        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading">Loading...</span>
            <span v-else>Masuk</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "vue-router";
import { EyeIcon, EyeOffIcon } from "lucide-vue-next";

definePageMeta({
  layout: false,
});
const auth = useAuthStore();
const router = useRouter();

const login = ref({ username: "", password: "" });
const isLoading = ref(false);
const showPassword = ref(false);
const formError = ref("");
const passwordError = ref("");

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const handleSubmit = async () => {
  formError.value = "";
  passwordError.value = "";

  if (!login.value.username || !login.value.password) {
    formError.value = "Username dan password wajib diisi";
    return;
  }

  isLoading.value = true;
  try {
    await auth.login(login.value.username, login.value.password);
    console.log("Login sukses, redirect ke /");
    await router.push("/dashboard");
    console.log("Selesai push, seharusnya sudah pindah halaman");
  } catch (err: any) {
    formError.value = err.message || "Gagal login";
    passwordError.value = "Periksa kembali username atau password Anda";
  } finally {
    isLoading.value = false;
  }
};
</script>
