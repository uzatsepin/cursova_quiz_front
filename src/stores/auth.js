import { defineStore } from 'pinia'
import axios from 'axios'
import router from '@/router'
import { useToastStore } from './toast'

const API_URL = 'http://localhost:3000/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  }),

  getters: {
    currentUser: (state) => state.user,
    userSettings: (state) => state.user?.settings,
  },

  actions: {
    setUser(user) {
      this.user = user
      this.isAuthenticated = !!user
      if (user) {
        localStorage.setItem('userEmail', user.email)
        localStorage.setItem('userPassword', user.password)
      }
    },

    async login(credentials) {
      this.loading = true
      this.error = null

      try {
        const response = await axios.post(`${API_URL}/login`, credentials)
        if (response.data && response.data.id) {
          this.setUser(response.data)
          const toastStore = useToastStore()
          toastStore.success('Ласкаво просимо!')
          router.push('/courses')
          return true
        } else {
          throw new Error('Некоректна відповідь від сервера')
        }
      } catch (error) {
        console.error('Помилка входу:', error)
        this.error = error.message || 'Невірний email або пароль'
        const toastStore = useToastStore()
        toastStore.error(this.error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      this.loading = true
      this.error = null

      try {
        const response = await axios.post(`${API_URL}/register`, userData)
        this.setUser(response.data)

        const toastStore = useToastStore()

        toastStore.success('Реєстрація успішна! Ласкаво просимо!')
        router.push('/courses')

        return true
      } catch (error) {
        console.error('Помилка реєстрації:', error)
        if (error.response?.data?.error === 'Email already exists') {
          this.error = 'Користувач з таким email вже існує'
          throw new Error('Користувач з таким email вже існує')
        }
        this.error = 'Помилка реєстрації'
        throw new Error('Помилка реєстрації')
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.clearAuth()
      const toastStore = useToastStore()
      toastStore.info('Ви вийшли з системи')
      router.push('/login')
    },

    async updateSettings(settings) {
      try {
        const response = await axios.put(`${API_URL}/settings`, settings, {
          headers: {
            email: this.user.email,
            password: this.user.password,
          },
        })
        this.user = { ...this.user, settings: response.data }

        const toastStore = useToastStore()
        toastStore.success('Налаштування оновлено')

        return response.data
      } catch (error) {
        console.error('Помилка оновлення налаштувань:', error)
        throw new Error('Не вдалося оновити налаштування')
      }
    },

    async checkAuth() {
      const email = localStorage.getItem('userEmail')
      const password = localStorage.getItem('userPassword')

      if (email && password) {
        try {
          const response = await axios.post(`${API_URL}/login`, { email, password })
          if (response.data && response.data.id) {
            this.setUser(response.data)
            return true
          }
          this.clearAuth()
          return false
        } catch (error) {
          console.error('Error during auth check:', error)
          this.clearAuth()
          return false
        }
      }
      return false
    },

    clearAuth() {
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('userEmail')
      localStorage.removeItem('userPassword')
    },
  },
})
