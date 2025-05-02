import { API } from './api'


const getA = new API('/api/a/:id')
  .params<{id: string}>()
  .fn(async (be) => {
    return be.json({ a: true })
  })


export const gets = {
  '/api/get/a': getA,
  '/api/get/b': new API('/api/b'),
}

export const posts = {
  '/api/post/a': new API('/api/c'),
  '/api/post/b': new API('/api/d'),
}
