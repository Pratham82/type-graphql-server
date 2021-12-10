import { Resolver, Mutation, Arg, Ctx } from 'type-graphql'
import brcypt from 'bcryptjs'
import { User } from '../../../../entity/User'
import { LoginResponse } from 'src/types/Responses'
import { MyContext } from 'src/types/MyContext'

@Resolver()
export class LoginResolver {
  @Mutation(() => User, { nullable: true })
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() ctx: MyContext
  ): Promise<User | LoginResponse> {
    // Validate user
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return { success: false, message: 'User not found' }
    }

    // Validate password
    const valid = await brcypt.compare(password, user.password)
    if (!valid) {
      return {
        success: false,
        message: 'Password does not match with our records',
      }
    }

    // creating a session in redis
    ctx.req.session!.userId = user.id

    return user
  }
}
