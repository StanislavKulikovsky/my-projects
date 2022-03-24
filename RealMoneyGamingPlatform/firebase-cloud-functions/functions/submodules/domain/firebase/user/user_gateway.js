const { UserGateway } = require("../../user/gateways/user_gateway")
const { userConverter } = require('./converters')
const { db, update, create, get, cloudStorage } = require('../firestore')
const { getBase64Type, getBase64DataString } = require("../../core/utils")
const { isAdminSDK } = require("../../firebase/firestore")
const { DomainError } = require("../../core/error")
const { Config } = require("../../user/config")

class FirestoreUserGateway extends UserGateway {
    constructor(transaction) {
        super()
        this.transaction = transaction
    }

    async getUserById(id) {
        let userRef = db.collection('users').doc(id)
        let user = await get(this.transaction, userRef, userConverter)

        return user.data()
    }

    async createUserProfile(user) {
        let userRef = db.collection('users').doc(user.id)
        user.createdAt = Date.now()
        user.modifiedAt = Date.now()
        user.id = userRef.id

        await create(this.transaction, userRef, user, userConverter)

        return user
    }

    async updateUserProfile(user) {
        let userRef = db.collection('users').doc(user.id)
        user.modifiedAt = Date.now()
        await update(this.transaction, userRef, user, userConverter)

        return user
    }
    
    async uploadUserAvatar(base64String, userId) {
        if (!isAdminSDK) {
            throw new DomainError(Config.errorDomains.user, Config.errorCodes.inappropriateUsage, "Please use appropriate API")
        }
        
        const file = cloudStorage.bucket().file(`${userId}/avatar`)
        const imageBuffer = Buffer.from(getBase64DataString(base64String), 'base64')
        await file.save(imageBuffer, {contentType: getBase64Type(base64String)})
    
        const downloadURL = await file.getSignedUrl({
            action: 'read',
            expires: '03-09-2491'
        }).then(urls => urls[0])

        return downloadURL
    }

    async deleteUserAvatar(userId){
        if (!isAdminSDK) {
            throw new DomainError(Config.errorDomains.user, Config.errorCodes.inappropriateUsage, "Please use appropriate API")
        }
        
        const file = cloudStorage.bucket().file(`${userId}/avatar`)
        await file.delete()
        
        return
    }

    async nameIsAvailable(name) {
        const query = db.collection('users').where('name', '==', name).limit(1)
        const snapshot = await get(this.transaction, query)
        
        return snapshot.empty ? true : false
    }
}

exports.FirestoreUserGateway = FirestoreUserGateway