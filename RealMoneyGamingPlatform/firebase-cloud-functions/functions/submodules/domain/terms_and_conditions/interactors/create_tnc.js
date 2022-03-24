const { DomainError } = require("../../core/error")
const { Config } = require("../config")
const { loadTermsAndConditionsByVersionInteractor } = require("./load_tnc_by_version")

async function createTermsAndConditionsInteractor(content, version, tncGateway) {
    const alreadyExsistingVersion = await loadTermsAndConditionsByVersionInteractor(version, tncGateway)
    if (alreadyExsistingVersion !== undefined) {
        throw new DomainError(Config.errorDomains.tnc, Config.errorCodes.alreadyExist, 'This version already exists')
    }

    return await tncGateway.createTermsAndConditions(content, version)
}

exports.createTermsAndConditionsInteractor = createTermsAndConditionsInteractor