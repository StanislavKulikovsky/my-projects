const { DomainError } = require('../../core/error')
const { Config } = require("../config")

class TncGateway {
    constructor() {

    }

    async getTermsAndConditions() {
        throw new DomainError(
            Config.errorDomains.quizGame,
            Config.errorCodes.notImplemented,
            'method getTermsAndConditions is not implemented')
    }

    async getTermsAndConditionsByVersion(version) {
        throw new DomainError(
            Config.errorDomains.quizGame, 
            Config.errorCodes.notImplemented, 
            'method getTermsAndConditionsByVersion is not implemented')
    }

    async getTermsAndConditionsActualVersion() {
        throw new DomainError(
            Config.errorDomains.quizGame,
            Config.errorCodes.notImplemented,
            'method getTermsAndConditionsActualVersion is not implemented')
    }

    async createTermsAndConditions() {
        throw new DomainError(
            Config.errorDomains.quizGame,
            Config.errorCodes.notImplemented,
            'method createTermsAndConditions is not implemented')
    }

    async updateTermsAndConditions(version) {
        throw new DomainError(
            Config.errorDomains.quizGame, 
            Config.errorCodes.notImplemented, 
            'method updateTermsAndConditions is not implemented')
    }

    async updateTermsAndConditionsActualVersion() {
        throw new DomainError(
            Config.errorDomains.quizGame,
            Config.errorCodes.notImplemented,
            'method updateTermsAndConditionsActualVersion is not implemented')
    }
}

exports.TncGateway = TncGateway