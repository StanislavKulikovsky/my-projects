const { User } = require("../entities/user")

async function createUserProfileInteractor(userId, userGateway) {
    const tempName = `User${Math.round((Date.now() / 100) % 100000000)}`
    let user = new User(userId, tempName, null, null)
    return await userGateway.createUserProfile(user)
}

exports.createUserProfileInteractor = createUserProfileInteractor