import { API } from './api'


export const gets = {
  '/api/get/a': new API({ path: '/api/get/a' }),
  '/api/get/b': new API({ path: '/api/get/b' }),
}


export const posts = {
  '/api/post/a': new API({ path: '/api/post/a' }),
  '/api/post/b': new API({ path: '/api/post/b' }),
}
