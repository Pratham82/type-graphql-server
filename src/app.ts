import { ApolloServer } from 'apollo-server-express'
import * as Express from 'express'
import { buildSchema } from 'type-graphql'
import 'reflect-metadata'
import { createConnection } from 'typeorm'
import { RegisterResolver } from './modules/user/resolver/user'
require('dotenv').config()

const main = async () => {
  // connect to postgres
  await createConnection()

  // gql schema
  const schema = await buildSchema({
    resolvers: [RegisterResolver],
  })

  // Init apolloServer
  const apolloServer = new ApolloServer({ schema })

  // Start apollo server
  await apolloServer.start()

  // Init express
  const app = Express()

  // attaching middleware
  apolloServer.applyMiddleware({ app })

  // REST Route
  app.get('/rest', (_, res) =>
    res.json({ success: true, message: 'Server started', route: 'rest' })
  )

  //starting server
  app.listen(process.env.PORT, () =>
    console.log(
      `Apollo server started on http://localhost:${process.env.PORT}/graphql`
    )
  )
}

main()
