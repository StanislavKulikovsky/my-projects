const Config = Object.freeze({
    errorDomains: {
        tnc: 'terms_and_conditions'
    },
    errorCodes: {
        unknown: 0,
        invalidParameter: 1,
        corruptedData: 2,
        notImplemented: 3,
        accessDenied:4,
        alreadyExist:5,
        doNotExist:6
    }
})

exports.Config = Config