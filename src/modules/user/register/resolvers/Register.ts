import { Resolver, Query, Mutation, Arg } from 'type-graphql'
import brcypt from 'bcryptjs'
import { User } from '../../../../entity/User'
import { RegisterInput } from '../inputs/Register'

// Creating a sample resolver
@Resolver()
export class RegisterResolver {
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
