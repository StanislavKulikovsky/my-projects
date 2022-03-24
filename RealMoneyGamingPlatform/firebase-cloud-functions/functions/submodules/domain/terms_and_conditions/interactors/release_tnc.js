const { updateTermsAndConditionsInteractor } = require("./update_tnc")
const { updateTermsAndConditionsActualVersionInteractor } = require("./update_tnc_actual_version")

async function releaseTermsAndConditionsInteractor( tnc, tncGateway) {
    tnc.isDraft = false
    const resultTnc = await updateTermsAndConditionsInteractor(tnc, tncGateway)
    await updateTermsAndConditionsActualVersionInteractor(resultTnc.version, tncGateway)

    return resultTnc
}

exports.releaseTermsAndConditionsInteractor = releaseTermsAndConditionsInteractor