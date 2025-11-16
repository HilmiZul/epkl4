import { useState } from 'nuxt/app';
import { usePocketBaseClient } from './pocketBaseClient'

type userType = {
  id: string,
  username: string,
  email: string,
  nama: string,
  nip: string,
  role: string,
  program_keahlian: string,
  status_pemetaan: boolean,
}

export const usePocketBaseUser = () => {
  let client = usePocketBaseClient()
  let user = useState<userType | null>('user', () => null)
  let isUserLoggedIn = client?.authStore.isValid;

  if(isUserLoggedIn) {
    user.value = {
      id: client?.authStore?.model?.id,
      username: client?.authStore?.model?.username,
      email: client?.authStore?.model?.email,
      nama: client?.authStore?.model?.nama,
      nip: client?.authStore?.model?.nip,
      role: client?.authStore?.model?.role,
      program_keahlian: client?.authStore?.model?.program_keahlian,
      status_pemetaan: client?.authStore?.model?.status_pemetaan,
    }
  } else {
    user.value = null
  }
  return { user, isUserLoggedIn }
}
