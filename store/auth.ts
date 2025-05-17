// ~/store/auth.ts
import { defineStore } from 'pinia'
import { login as loginApi } from '@/composables/consume-api/auth.api' // ✅ gunakan alias
import type { LoginResponse } from '@/types/auth'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as LoginResponse['response'] | null,
        token: null as string | null
    }),

    getters: {
        isAuthenticated: (state) => !!state.token
    },

    actions: {
        async login(username: string, password: string) {
            try {
                const response = await loginApi({ username, password }) // ✅ gunakan fungsi dari file API

                this.user = response.response
                this.token = response.response.token

                localStorage.setItem('token', this.token ?? '')
                localStorage.setItem('user', JSON.stringify(response.response))
                localStorage.setItem('key', response.response.key)
            } catch (err: any) {
                throw new Error(err?.data?.metaData?.message || 'Login gagal')
            }
        },

        logout() {
            this.user = null
            this.token = null
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            localStorage.removeItem('key')
        },

        restore() {
            this.token = localStorage.getItem('token')
            const user = localStorage.getItem('user')
            this.user = user ? JSON.parse(user) : null
        }
    }
})
