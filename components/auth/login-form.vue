<template>
  <div class="flex flex-col items-center w-full max-w-md mx-auto px-4">
    <h1 class="text-3xl font-bold mb-8">MASUK</h1>

    <div class="w-full space-y-6">
      <div class="space-y-1">
        <div class="flex border border-gray-300 rounded-md overflow-hidden">
          <div
            class="bg-gray-50 px-3 py-2 text-gray-500 border-r border-gray-300"
          >
            +62
          </div>
          <input
            v-model="phoneNumber"
            type="text"
            placeholder="Nomor WhatsApp"
            class="flex-1 px-3 py-2 outline-none"
            @keyup.enter="handleLogin"
          />
        </div>
        <p class="text-xs text-gray-500">Contoh : 89673647187</p>
        <p v-if="phoneError" class="text-xs text-red-500">{{ phoneError }}</p>
      </div>

      <div class="flex items-start space-x-2">
        <input
          v-model="agreeToTerms"
          type="checkbox"
          id="terms"
          class="mt-1 h-4 w-4 accent-orange-500"
        />
        <label for="terms" class="text-xs text-gray-600">
          Saya menyetujui syarat & ketentuan serta kebijakan yang berlaku
        </label>
      </div>

      <button
        @click="handleLogin"
        :disabled="!isFormValid || isLoading"
        class="w-full py-3 bg-orange-500 text-white rounded-md font-medium transition-colors"
        :class="{
          'opacity-70 cursor-not-allowed': !isFormValid || isLoading,
          'hover:bg-orange-600': isFormValid && !isLoading,
        }"
      >
        <span v-if="isLoading">Memproses...</span>
        <span v-else>Masuk</span>
      </button>

      <p v-if="apiError" class="text-red-500 text-sm text-center">
        {{ apiError }}
      </p>

      <div class="text-center">
        <p class="text-sm">
          Belum punya akun?
          <NuxtLink to="/auth/register" class="text-orange-500 font-medium"
            >Daftar</NuxtLink
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

import { useFetchApi, useAuth } from "@/composables/users/use-auth"; // Import the fetch function directly

const router = useRouter();
const { login } = useAuth();
const { fetchApi, isLoading: fetchLoading, error: fetchError } = useFetchApi();

const phoneNumber = ref("");
const phoneError = ref("");
const agreeToTerms = ref(false);
const apiError = ref<string | null>(null);
const isLoading = ref(false);

// Validate phone number format (Indonesian numbers without +62)
const validatePhoneNumber = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length >= 10 && cleaned.length <= 14;
};

const isFormValid = computed(() => {
  return validatePhoneNumber(phoneNumber.value) && agreeToTerms.value;
});

const validateForm = (): boolean => {
  phoneError.value = "";

  if (!phoneNumber.value) {
    phoneError.value = "Nomor WhatsApp harus diisi";
    return false;
  }

  if (!validatePhoneNumber(phoneNumber.value)) {
    phoneError.value = "Nomor HP harus terdiri dari 10-14 digit angka";
    return false;
  }

  if (!agreeToTerms.value) {
    apiError.value = "Anda harus menyetujui syarat dan ketentuan";
    return false;
  }

  return true;
};

const handleLogin = async () => {
  if (!validateForm()) return;

  isLoading.value = true;
  apiError.value = null;

  try {
    // Format phone number to +62XXXXXXXXXX
    const formattedPhone = `+62${phoneNumber.value.replace(/\D/g, "").replace(/^0+/, "")}`;

    // Call the API to request OTP
    const response = await fetchApi("/auth/request-otp", {
      method: "POST",
      body: {
        phoneNumber: formattedPhone,
      },
    });

    // If successful, store the session ID and redirect to OTP verification
    if (response?.sessionId) {
      // You might want to store the session ID in a cookie or local storage
      router.push({
        path: "/auth/verify-otp",
        query: { phone: formattedPhone },
      });
    }
  } catch (error: any) {
    console.error("Login error:", error);
    apiError.value = error.message || "Terjadi kesalahan saat memproses login";
    if (error.response?.data?.message) {
      apiError.value = error.response.data.message;
    }
  } finally {
    isLoading.value = false;
  }
};
</script>
