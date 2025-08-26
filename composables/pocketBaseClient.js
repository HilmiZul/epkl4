import PocketBase from 'pocketbase';

const config = useRuntimeConfig()
const host = config.public.apiBaseUrl
const port = config.public.apiPort
const pb = new PocketBase(host+":"+port);

export const usePocketBaseClient = () => {
  return pb
}
