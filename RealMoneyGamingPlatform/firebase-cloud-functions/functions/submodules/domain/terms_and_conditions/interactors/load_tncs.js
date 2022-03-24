async function loadTermsAndConditionsInteractor(pageSize, nextPageToken, tncGateway) {
    return await tncGateway.getTermsAndConditions(nextPageToken, pageSize)
}

exports.loadTermsAndConditionsInteractor = loadTermsAndConditionsInteractor