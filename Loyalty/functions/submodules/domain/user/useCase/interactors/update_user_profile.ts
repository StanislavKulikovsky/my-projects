import { User } from "../../entities/user"
import { IUserGateway } from "../user_gateway_inteface"


/**
 * Interactor for creating new blank user profile
 * @param {User} user user entity
 * @param {IUserGateway} userGateway an instance of userGateway
 * @return {Promise<User>} promise that returns an User entity of updated user profile
 */
export async function updateUserProfileInteractor(user: User, userGateway: IUserGateway): Promise<User> {
    const recievedUser = await userGateway.updateUserProfile(user)
    return recievedUser
}
