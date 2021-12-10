import { ApolloServer } from 'apollo-server-express'
import Express from 'express'
import { buildSchema } from 'type-graphql'
import 'reflect-metadata'
import { createConnection } from 'typeorm'
import session from 'express-session'
import connectRedis from 'connect-redis'
import { redis } from './redis'
import cors from 'cors'

import { RegisterResolver } from './modules/user/register/resolvers/Register'
import { LoginResolver } from './modules/user/login/resolvers/Login'
import { MeResolver } from './modules/user/me'

require('dotenv').config()

const main = async () => {
  // connect to postgres
  await createConnection()

  // gql schema
  const schema = await buildSchema({
    resolvers: [MeResolver, RegisterResolver, LoginResolver],
  })

  // Init apolloServer
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }: any) => ({ req }),
  })

  // Start apollo server
  await apolloServer.start()

  // Init express
  const app = Express()

  // Add cors
  app.use(cors())
  app.use(
    cors({
      credentials: true,
      origin: 'http://localhost:3000',
    })
  )

  // Add session
  const RedisStore = connectRedis(session)

  // Add session middleWare
  app.use(
    session({
      store: new RedisStore({
        client: redis as any,
      }),
      name: 'qid',
      secret: 'MySecret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
      },
    })
  )

  // attaching middleware
  apolloServer.applyMiddleware({ app })

  // REST Route
  app.get('/rest', (_, res) =>
    res.json({ success: true, message: 'Server started', route: 'rest' })
  )

  //starting server
  app.listen(process.env.PORT, () =>
    console.log(
      `🚀 Apollo server started 🟢 on http://localhost:${process.env.PORT}/graphql`
    )
  )
}

main()
