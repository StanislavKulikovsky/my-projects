import { Transaction } from "../../firebase/firestore"
import { User } from "../entities/user"

export interface IUserGateway {
    transaction?: Transaction

    createUserProfile(user: User): Promise<User>
    updateUserProfile(user: User): Promise<User>
    getUserById(userId: string): Promise<User>
}
