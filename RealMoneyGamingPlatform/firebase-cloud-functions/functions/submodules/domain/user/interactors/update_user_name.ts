import { DomainError } from "../../core/error"
import { Config } from "../config"

export async function updateUserNameInteractor(userId: string, name: string, userGateway: any) {
    const nameIsAvailable = await userGateway.nameIsAvailable(name)
    if (!nameIsAvailable) {
        throw new DomainError(Config.errorDomains.user, Config.errorCodes.nonUniqueName, "Nickname is already taken")
    }
    let user = await userGateway.getUserById(userId)
    user.name = name
    user = await userGateway.updateUserProfile(user)
    return user
}
