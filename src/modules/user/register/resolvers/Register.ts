import { Resolver, Query, Mutation, Arg, UseMiddleware } from 'type-graphql'
import brcypt from 'bcryptjs'
import { User } from '../../../../entity/User'
import { RegisterInput } from '../inputs/Register'
import { isAuth } from '../../../middleware/isAuth'
import { logger } from '../../../middleware/logger'

// Creating a sample resolver
@Resolver()
export class RegisterResolver {
  @UseMiddleware(isAuth, logger)
  @Query(() => String, {
    name: 'hello',
    description: 'This is a sample resolver',
    nullable: true,
  })
  async helloWorld() {
    return 'Hello World from Hello Resolver 😄'
  }

  @Mutation(() => User)
  async register(
    @Arg('registerInput')
    { firstName, lastName, email, password }: RegisterInput
  ): Promise<User> {
    const hashedPassword = await brcypt.hash(password, 12)
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    }).save()

    return user
  }
}
