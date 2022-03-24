const { DomainError } = require("../../core/error")
const { loadTermsAndConditionsByVersionInteractor } = require("./load_tnc_by_version")
const { Config } = require("../config")

async function updateTermsAndConditionsActualVersionInteractor( version, tncGateway) {
    const alreadyExsistingVersion = await loadTermsAndConditionsByVersionInteractor(version, tncGateway)
    if (alreadyExsistingVersion === undefined) {
        throw new DomainError(Config.errorDomains.tnc, Config.errorCodes.doNotExist, 'This version doesn\'t exist')
    }

    return await tncGateway.updateTermsAndConditionsActualVersion(version)
}

exports.updateTermsAndConditionsActualVersionInteractor = updateTermsAndConditionsActualVersionInteractor