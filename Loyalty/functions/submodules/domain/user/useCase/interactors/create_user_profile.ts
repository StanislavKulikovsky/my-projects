import { User } from "../../entities/user"
import { IUserGateway } from "../user_gateway_inteface"

/**
 * Interactor for creating new blank user profile
 * @param {string} userId unique user identifier
 * @param {IUserGateway} userGateway an instance of userGateway
 * @return {Promise<User>} promise that returns an User entity of created user profile
 */
export async function createUserProfileInteractor(userId: string, userGateway: IUserGateway): Promise<User> {
    const user = new User(userId)
    const recievedUser = await userGateway.createUserProfile(user)
    return recievedUser
}
