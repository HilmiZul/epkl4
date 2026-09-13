import { usePocketBaseClient } from '@/composables/pocketBaseClient'

export default defineNuxtRouteMiddleware(async (to, _from) => {
  const client = usePocketBaseClient()
  const isUserLoggedIn = await client.authStore.isValid

  if(!isUserLoggedIn) {
    return navigateTo('/login')
  }
})
