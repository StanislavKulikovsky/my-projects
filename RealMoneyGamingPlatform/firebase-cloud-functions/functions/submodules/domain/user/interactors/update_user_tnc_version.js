async function updateUserTncVersionInteractor(user, version, userGateway) {
    user.tncVersion = version
    await userGateway.updateUserProfile(user)
    return user
}

exports.updateUserTncVersionInteractor = updateUserTncVersionInteractor