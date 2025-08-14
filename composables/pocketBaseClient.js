import PocketBase from 'pocketbase';
const config = useRuntimeConfig()
const pb = new PocketBase(config.public.apiBaseUrl);

export const usePocketBaseClient = () => {
  return pb
}
