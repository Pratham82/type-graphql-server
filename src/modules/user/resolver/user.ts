import {
  Resolver,
  Query,
  Mutation,
  Arg,
  FieldResolver,
  Root,
} from 'type-graphql'
import * as brcypt from 'bcryptjs'
import { User } from '../../../entity/User'

// Creating a sample resolver
@Resolver(User)
export class RegisterResolver {
  @Query(() => String, {
    name: 'hello',
    description: 'This is a sample resolver',
    nullable: true,
  })
  async helloWorld() {
    return 'Hello World from Hello Resolver 😄'
  }

  @FieldResolver(() => String, {
    name: 'fullName',
    description: 'Get full name of the user',
  })
  async fullName(@Root() parent: User) {
    return `${parent.firstName} ${parent.lastName}`
  }

  @Mutation(() => User)
  async register(
    @Arg('firstName') firstName: string,
    @Arg('lastName') lastName: string,
    @Arg('email') email: string,
    @Arg('password') password: string
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
