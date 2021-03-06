# Notes

1. **Return Types** In resolvers for returning the type of mutation we have to return a promise with a diamond operator which has the type of entity(schema). For eg:

```typescript

// Entity
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  firstName: string
}


// Mutation
@Mutation(() => User)
  async register(...): Promise<User> {

```

2. **ObjectType()** For mapping the type of register mutation we have to annotate with @ObjectType() decorator to the entity i.e User class so in that way it can determine graphql output type for our register resolver. For querying the fields in graphql we have to use the @Field decorator , this will expose the field to graphql schema. Fields like password should be inaccessible to the user so for hiding these fields we will not add the field decorator to the password.

```typescript
@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column()
  firstName: string

  @Column()
  password: string
```

3. **FieldResolvers()** We can add fields which are only graphql types, like some field which we don't want to store in the database but query them.For eg we want the fullName of the user which comprises of firstName and lastName field. For doing that we can use the FieldResolver, but before that we have to pass in the entity in the Resolver. While using the fieldResolver we have to add the argument i.e parent which wil be annotated with Root decorator, so we can access the current user. This can be used at many places, such as if want to do a quick calculation an don't want to store the results in the database we can just use the fieldResolver.

```typescript
@Resolver(User)
export class RegisterResolver {

  @FieldResolver()
  async fullName(@Root() parent: User) {
    return `${User.firstName} ${User.lastName}`
  }
```

4. We can achieve the same result as above by just adding another field in an User entity. This field will not be saved in database. This will work as getter function

```typescript
  @Field()
  fullName(@Root() parent: User): string {
    return `${parent.firstName} ${parent.lastName}`
  }
```

5. **Custom validator** using class validator we can create custom validator for our specific useCase just like we did in **isEmailAvailable** validator. We can add custom message in a response.

6. **context**: Here we are passing the function in context key, which will create a context that can be used in the resolver. ApolloServer gives us access to the request object, which is from express and we can access the session data based on this.

```typescript
// Init apolloServer
const apolloServer = new ApolloServer({
  schema,
  context: ({ req }) => ({ req }),
})
```

For actually accessing the context in the resolver we have to create a type of context and return the required fields. In this case required the request object in the context so we will add the request object in the interface.

```typescript
import {Request}  form 'express'
export interface MyContext{
  req: Request
}
```
