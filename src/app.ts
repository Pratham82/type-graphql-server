import { ApolloServer } from 'apollo-server-express'
import * as Express from 'express'
import { buildSchema, Query, Resolver } from 'type-graphql'
import 'reflect-metadata'
require('dotenv').config()

// Creating a sample resolver
@Resolver()
class HelloResolver {
  @Query(() => String, {
    name: 'hello',
    description: 'This is a sample resolver',
    nullable: true,
  })
  async helloWorld() {
    return 'Hello World from Hello Resolver 😄'
  }
}

const main = async () => {
  // gql schema
  const schema = await buildSchema({
    resolvers: [HelloResolver],
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
