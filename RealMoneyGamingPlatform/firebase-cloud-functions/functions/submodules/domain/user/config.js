const Config = Object.freeze({
    errorDomains: {
        user: 'user',
    },
    errorCodes: {
        // Generic codes from 0 to 1000
        unknown: 0,
        invalidParameter: 1,
        corruptedData: 2,
        notImplemented: 3,
        inappropriateUsage: 4,
        nonUniqueName: 5
    }
})

exports.Config = Config