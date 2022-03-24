async function updateTermsAndConditionsInteractor(tnc, tncGateway) {
    return await tncGateway.updateTermsAndConditions(tnc)
}

exports.updateTermsAndConditionsInteractor = updateTermsAndConditionsInteractor