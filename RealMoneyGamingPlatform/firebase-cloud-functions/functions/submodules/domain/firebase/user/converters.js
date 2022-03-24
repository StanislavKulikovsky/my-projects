const { User } = require("../../user/entities/user")

const userConverter = {
    toFirestore: (doc) => doc.asDTO(),
    fromFirestore: (snapshot, options) => User.createFromDTO(snapshot.data(options))
}

exports.userConverter = userConverter