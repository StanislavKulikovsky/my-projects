async function getUserByIdInteractor(userId, userGateway) {
    return await userGateway.getUserById(userId)
}

exports.getUserByIdInteractor = getUserByIdInteractor