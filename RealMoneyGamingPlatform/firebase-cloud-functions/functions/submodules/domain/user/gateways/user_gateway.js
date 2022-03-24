const { DomainError } = require("../../core/error")
const { Config } = require("../config")

class UserGateway {
    constructor() {

    }

    getUserById(id) {
        throw new DomainError(
            Config.errorDomains.user, 
            Config.errorCodes.notImplemented, 
            'method getUserById is not implemented')
    }

    createUserProfile(user) {
        throw new DomainError(
            Config.errorDomains.user, 
            Config.errorCodes.notImplemented, 
            'method createUserProfile is not implemented')
    }
    
    updateUserProfile(user) {
        throw new DomainError(
            Config.errorDomains.user, 
            Config.errorCodes.notImplemented, 
            'method updateUserProfile is not implemented')
    }

    uploadUserAvatar(file, id) {
        throw new DomainError(
            Config.errorDomains.user, 
            Config.errorCodes.notImplemented, 
            'method uploadUserAvatar is not implemented')
    }
    
    deleteUserAvatar(id){
        throw new DomainError(
            Config.errorDomains.user, 
            Config.errorCodes.notImplemented, 
            'method deleteUserAvatar is not implemented')
    }

    nameIsAvailable(name){
        throw new DomainError(
            Config.errorDomains.user, 
            Config.errorCodes.notImplemented, 
            'method nameIsAvailable is not implemented')
    }
}

exports.UserGateway = UserGateway