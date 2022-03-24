import { User } from "../../entities/user"
import { IUserGateway } from "../user_gateway_inteface"

export async function getUserProfileByIdInteractor(userId: string, userGateway: IUserGateway): Promise<User> {
    return await userGateway.getUserById(userId)
}
