import fastify from 'fastify'
import { knex } from './database'
import crypto from 'node:crypto'

const app = fastify()

app.get('/', async () => {
  const tables = await knex('users')
    .insert({
      id: crypto.randomUUID(),
      name: 'X-tudo',
      description: 'Xis completo da lancheira do bairro',
      in_diet: false,
    })
    .returning('*')
  return tables
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('Server is running on port 3333')
  })
