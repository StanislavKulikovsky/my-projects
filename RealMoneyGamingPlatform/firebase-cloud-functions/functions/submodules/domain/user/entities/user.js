/**
 * Tournament user
 */
class User {
    /**
     * 
     * @param {String} id unique user identifier
     * @param {String} name user nickname
     * @param {String} avatarURL URL of avatar image
     * @param {String} tncVersion virsion of accepted Terms and Conditions
     * @param {Date} createdAt date of creation of the user profile
     * @param {Date} modifiedAt date when user profile has been modified last time
     */
    constructor(id, name, avatarURL, tncVersion, createdAt, modifiedAt) {
        this.id = id
        this.name = name
        this.avatarURL = avatarURL
        this.tncVersion = tncVersion
        this.createdAt = createdAt
        this.modifiedAt = modifiedAt
    }

    static createFromDTO(data) {
        return new User(
            data.id,
            data.name,
            data.avatarURL,
            data.tncVersion,
            data.createdAt,
            data.modifiedAt
        )
    }

    asDTO() {
        return {
            id: this.id,
            name: this.name,
            avatarURL: this.avatarURL,
            tncVersion: this.tncVersion,
            createdAt: this.createdAt,
            modifiedAt: this.modifiedAt
        }
    }
}

exports.User = User