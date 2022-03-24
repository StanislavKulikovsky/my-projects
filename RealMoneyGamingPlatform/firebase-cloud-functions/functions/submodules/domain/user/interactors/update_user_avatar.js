const { DomainError } = require("../../core/error")
const { isId, getBase64DataString, getBase64Type, isString } = require("../../core/utils")
const { Config } = require("../config")

/**
 * @param {String} base64String uploading base64 String
 * @param {String} userId unique user identifier
 * @param {Date} userGateway user gateway
 */
async function updateUserAvatarInteractor(base64String, userId, userGateway) {
    const fileBasicType = getBase64Type(base64String).slice(0,5)
    if (fileBasicType !== 'image') {
       throw new DomainError(Config.errorDomains.user, Config.errorCodes.invalidParameter, "Invalid uploading file type")
    }

    const dataString = getBase64DataString(base64String)
    const dataSize = Math.round(dataString.length * 3 / 4)
    if (dataSize > 1048576) {
        throw new DomainError(Config.errorDomains.user, Config.errorCodes.invalidParameter, "Maximum file size is 1MB")
    }

    if(!isId(userId)) {
        throw new DomainError(Config.errorDomains.user, Config.errorCodes.invalidParameter, "Missing or invalid user id")
    }

    const downloadURL = await userGateway.uploadUserAvatar(base64String, userId)

    if(!isString(downloadURL)) {
        throw new DomainError(Config.errorDomains.user, Config.errorCodes.corruptedData, "Missing or invalid URL created")
    }

    const user = await userGateway.getUserById(userId)
    user.avatarURL = downloadURL
    await userGateway.updateUserProfile(user)

    return user
}

exports.updateUserAvatarInteractor = updateUserAvatarInteractor