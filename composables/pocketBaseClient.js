import PocketBase from 'pocketbase';

const pb = new PocketBase('http://localhost:8090');

export const usePocketBaseClient = () => {
  return pb
}
