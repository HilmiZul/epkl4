import PocketBase from 'pocketbase';
const config = useRuntimeConfig()
const host = config.public.apiBaseUrl+":"+config.public.apiPort
const pb = new PocketBase(host);

export const usePocketBaseClient = () => {
  return pb
}
