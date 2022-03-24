const { DomainError } = require("../../core/error")
const { isId } = require("../../core/utils")
const { Config } = require("../config")

async function deleteUserAvatarInteractor(userId, userGateway) {
    if(!isId(userId)) {
        throw new DomainError(Config.errorDomains.user, Config.errorCodes.invalidParameter, "Missing or invalid user id")
    }

    await userGateway.deleteUserAvatar(userId).catch((error) => {throw error})

    const user = await userGateway.getUserById(userId)
    user.avatarURL = null
    await userGateway.updateUserProfile(user)
    return user
}

exports.deleteUserAvatarInteractor = deleteUserAvatarInteractor