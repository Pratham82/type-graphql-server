import { User } from 'src/entity/User'

export interface LoginResponse {
  success: boolean
  message: string
  data?: User
}
