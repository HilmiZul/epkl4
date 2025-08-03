import { usePocketBaseUser } from '@/composables/pocketBaseUser'

export default defineNuxtRouteMiddleware(async (to, _from) => {
  const user = usePocketBaseUser()

  if(user?.user.value.role != 'admin') {
    return navigateTo('/404')
  }
})
