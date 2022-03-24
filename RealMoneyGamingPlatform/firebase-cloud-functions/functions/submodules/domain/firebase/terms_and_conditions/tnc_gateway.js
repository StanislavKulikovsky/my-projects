const { DomainError } = require('../../core/error')
const { isString } = require('../../core/utils')
const { Config } = require('../../terms_and_conditions/config')
const { TermsAndConditions } = require('../../terms_and_conditions/entities/tnc')
const { TncGateway } = require('../../terms_and_conditions/gateways/tnc_gateway')
const { db, get, getCollection, create, update } = require('../firestore')
const { tncConverter } = require('./converters')
let tncDocRef = db.collection('configs').doc('terms_and_conditions')
let tncCollectionRef = tncDocRef.collection('tnc_version_store')

class FirestoreTncGateway extends TncGateway {
    constructor(transaction) {
        super()
        this.transaction = transaction
    }

    async getTermsAndConditions(nextPageToken, pageSize) {       
        let query = tncCollectionRef 
        query = query.orderBy('version', "desc")

        return await getCollection(
            tncCollectionRef,
            query,
            tncConverter,
            nextPageToken,
            pageSize,
            this.transaction
        )
    }

    async getTermsAndConditionsByVersion(version) { 
        if (!isString(version)) {
            throw new DomainError(Config.errorDomains.tnc,Config.errorCodes.invalidParameter, 'Invalid or missing version value')
        }

        let query = tncCollectionRef.where("version", "==", version).limit(1)
        let tncs = await get(this.transaction, query, tncConverter)
        return tncs.empty ? undefined : tncs.docs[0].data()
    }

    async getTermsAndConditionsActualVersion() {
        let tncSnapshot = await get(this.transaction, tncDocRef)
        return tncSnapshot.data().version
    }

    async createTermsAndConditions(content, version) {
        let tncRef = tncCollectionRef.doc()
        let tnc = new TermsAndConditions()
        tnc.createdAt = Date.now()
        tnc.modifiedAt = Date.now()
        tnc.content = content
        tnc.version = version
        tnc.id = tncRef.id
        tnc.isDraft = true

        await create(this.transaction, tncRef, tnc, tncConverter)

        return tnc
    }

    async updateTermsAndConditions(tnc) {
        let tncRef = tncCollectionRef.doc(tnc.id)
        await update(this.transaction, tncRef, tnc, tncConverter)

        return tnc
    }

    async updateTermsAndConditionsActualVersion(version) {
        await update(this.transaction, tncDocRef, {version: version})

        return version
    }
}

exports.FirestoreTncGateway = FirestoreTncGateway