import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'

export async function Diet(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const sessionId = request.cookies.sessionId

    if (!sessionId) {
      return reply.status(401).send({
        error: 'Unauthorized',
      })
    }
    const diets = await knex('diets').where('sessionId', sessionId).select()

    return { diets }
  })

  app.get('/summary', async (_request, reply) => {
    const summary = await knex('diets')
      .sum('description', { as: 'description' })
      .sum('in_diet', { as: 'in_diet' })
      .first()
    return { summary }
  })

  app.get('/:id', async (request, _reply) => {
    const getDietParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getDietParamsSchema.parse(request.params)

    const diet = await knex('diets').where('id', id).first()
    return { diet }
  })

  app.post('/', async (request, reply) => {
    const createDietBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      inDiet: z.boolean(),
    })

    const { name, description } = createDietBodySchema.parse(request.body)

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    await knex('diets').insert({
      id: randomUUID(),
      name,
      description,
      session_id: sessionId,
    })

    return reply.status(201).send('Created Diet')
  })
}
