import { usePocketBaseUser } from '@/composables/pocketBaseUser'
import { usePocketBaseClient } from '@/composables/pocketBaseClient'

export default defineNuxtRouteMiddleware(async (to, _from) => {
  const user = usePocketBaseUser()
  const client = usePocketBaseClient()
  const isUserLoggedIn = await client.authStore.isValid

  if(isUserLoggedIn) {
    console.log(user?.user.value)
    if(user?.user.value.role != 'admin' || user?.user.value.role != 'tu') {
      return navigateTo('/404')
    }
  }
})
