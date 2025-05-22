import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export const useCourseStore = defineStore('courses', {
  state: () => ({
    courses: [],
    currentCourse: null,
    loading: false,
    error: null,
    userProgress: {
      score: 0,
      finishedCourses: [],
      completedTests: [],
      totalAttempts: 0,
      correctAnswers: 0,
      totalPoints: 0,
      attempts: [],
    },
  }),

  getters: {
    availableCourses: (state) => state.courses,
    currentCourseTests: (state) => state.currentCourse?.tests || [],
    isTestCompleted: (state) => (testId) => {
      return state.userProgress.attempts.some(
        (attempt) => attempt.testId === testId && attempt.isCorrect,
      )
    },
    isCourseCompleted: (state) => (courseId) => {
      const course = state.courses.find((c) => c.id === courseId)
      if (!course || !course.tests || course.tests.length === 0) return false

      return course.tests.every((test) =>
        state.userProgress.attempts.some(
          (attempt) => attempt.testId === test.id && attempt.isCorrect,
        ),
      )
    },
    getCompletedTestsCount: (state) => (courseId) => {
      const course = state.courses.find((c) => c.id === courseId)
      if (!course || !course.tests) return 0

      const completedTestIds = new Set(
        state.userProgress.attempts
          .filter(
            (attempt) =>
              attempt.isCorrect && course.tests.some((test) => test.id === attempt.testId),
          )
          .map((attempt) => attempt.testId),
      )

      return completedTestIds.size
    },
  },

  actions: {
    async fetchUserProgress() {
      try {
        const response = await axios.get(`${API_URL}/progress`, {
          headers: {
            email: localStorage.getItem('userEmail'),
            password: localStorage.getItem('userPassword'),
          },
        })

        const attemptsResponse = await axios.get(`${API_URL}/user/attempts`, {
          headers: {
            email: localStorage.getItem('userEmail'),
            password: localStorage.getItem('userPassword'),
          },
        })

        this.userProgress = {
          score: response.data.score,
          finishedCourses: response.data.finishedCourses,
          totalAttempts: attemptsResponse.data.total,
          correctAnswers: attemptsResponse.data.correctAnswers,
          totalPoints: attemptsResponse.data.totalPoints,
          attempts: attemptsResponse.data.attempts,
          completedTests: [
            ...new Set(
              attemptsResponse.data.attempts
                .filter((attempt) => attempt.isCorrect)
                .map((attempt) => attempt.testId),
            ),
          ],
        }
      } catch (error) {
        console.error('Помилка отримання прогресу:', error)
        throw error
      }
    },

    async fetchCourses() {
      this.loading = true
      try {
        const response = await axios.get(`${API_URL}/courses`, {
          headers: {
            email: localStorage.getItem('userEmail'),
            password: localStorage.getItem('userPassword'),
          },
        })
        this.courses = response.data
        await this.fetchUserProgress()
        this.error = null
      } catch (error) {
        console.error('Помилка отримання курсів:', error)
        this.error = 'Не вдалося завантажити курси'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchCourseTests(courseId) {
      this.loading = true
      try {
        const response = await axios.get(`${API_URL}/courses/${courseId}/tests`, {
          headers: {
            email: localStorage.getItem('userEmail'),
            password: localStorage.getItem('userPassword'),
          },
        })
        const course = this.courses.find((c) => c.id === courseId)
        if (course) {
          course.tests = response.data
        }
        this.error = null
      } catch (error) {
        console.error('Помилка отримання тестів:', error)
        this.error = 'Не вдалося завантажити тести'
        throw error
      } finally {
        this.loading = false
      }
    },

    async submitTestAnswer(testId, answer) {
      try {
        const response = await axios.post(
          `${API_URL}/tests/${testId}/submit`,
          { answer },
          {
            headers: {
              email: localStorage.getItem('userEmail'),
              password: localStorage.getItem('userPassword'),
            },
          },
        )
        return response.data
      } catch (error) {
        console.error('Помилка відправки відповіді:', error)
        throw error
      }
    },

    async addCourse(courseData) {
      this.loading = true
      try {
        const response = await axios.post(`${API_URL}/courses`, courseData, {
          headers: {
            email: localStorage.getItem('userEmail'),
            password: localStorage.getItem('userPassword'),
          },
        })
        this.courses.push(response.data)
        this.error = null
        return response.data
      } catch (error) {
        console.error('Помилка створення курсу:', error)
        if (error.response?.data?.error === 'Course with this order number already exists') {
          this.error = 'Курс з таким порядковим номером вже існує'
          throw new Error('Курс з таким порядковим номером вже існує')
        } else if (error.response?.data?.error === 'Title and order number are required') {
          this.error = "Назва та порядковий номер є обов'язковими"
          throw new Error("Назва та порядковий номер є обов'язковими")
        }
        this.error = 'Не вдалося створити курс'
        throw error
      } finally {
        this.loading = false
      }
    },

    setCurrentCourse(course) {
      this.currentCourse = course
    },

    async addTest(courseId, testData) {
      this.loading = true
      try {
        const response = await axios.post(`${API_URL}/courses/${courseId}/tests`, testData, {
          headers: {
            email: localStorage.getItem('userEmail'),
            password: localStorage.getItem('userPassword'),
          },
        })

        const course = this.courses.find((c) => c.id === courseId)
        if (course) {
          if (!course.tests) course.tests = []
          course.tests.push(response.data)
        }

        this.error = null
        return response.data
      } catch (error) {
        console.error('Помилка створення тесту:', error)
        if (
          error.response?.data?.error === 'Question, options array, and correctAnswer are required'
        ) {
          this.error = "Питання, варіанти відповідей та правильна відповідь є обов'язковими"
          throw new Error("Питання, варіанти відповідей та правильна відповідь є обов'язковими")
        } else if (
          error.response?.data?.error === 'Options must be an array with at least 2 choices'
        ) {
          this.error = 'Потрібно надати мінімум 2 варіанти відповіді'
          throw new Error('Потрібно надати мінімум 2 варіанти відповіді')
        }
        this.error = 'Не вдалося створити тест'
        throw error
      } finally {
        this.loading = false
      }
    },
  },
})
