import { IsEmail, Length } from 'class-validator'
import { Field, InputType } from 'type-graphql'
import { IsEmailAvailable } from './isEmailAvailable'

@InputType()
export class RegisterInput {
  @Field()
  @Length(1, 255)
  firstName: string

  @Field()
  @Length(1, 255)
  lastName: string

  @Field()
  @IsEmail()
  @IsEmailAvailable({ message: 'Email Already exists' })
  email: string

  @Field()
  password: string
}
