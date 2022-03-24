async function loadTermsAndConditionsByVersionInteractor(version, tncGateway) {
    return await tncGateway.getTermsAndConditionsByVersion(version)
}

exports.loadTermsAndConditionsByVersionInteractor = loadTermsAndConditionsByVersionInteractor