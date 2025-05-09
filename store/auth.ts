import { defineStore } from 'pinia'
import { useApi } from '@/composables/use-fetch-api'
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
                const response = await useApi<LoginResponse>('/auth/login/administrator', {
                    method: 'POST',
                    body: { username, password }
                })

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
