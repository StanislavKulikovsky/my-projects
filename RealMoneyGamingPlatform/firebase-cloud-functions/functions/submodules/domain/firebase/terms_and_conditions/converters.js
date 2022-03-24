const { TermsAndConditions } = require("../../terms_and_conditions/entities/tnc")

const tncConverter = {
    toFirestore: (doc) => doc.asDTO(),
    fromFirestore: (snapshot, options) => TermsAndConditions.createFromDTO(snapshot.data(options))
}

exports.tncConverter = tncConverter