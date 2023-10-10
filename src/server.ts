import fastify from 'fastify'
import { Diet } from './routes/Diet'
import { env } from './env'
import cookie from '@fastify/cookie'

const app = fastify()

app.register(cookie)
app.register(Diet, {
  prefix: '/diet',
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('Server is running on port 3333')
  })
