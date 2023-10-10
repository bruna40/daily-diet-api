// eslint-disable-next-line prettier/prettier
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      description: string
      created_at: string
      in_diet: boolean
    }
  }
}
