const { DomainError } = require("../../core/error")
const { isId, isString } = require("../../core/utils")
const { Config } = require("../config")

class TermsAndConditions {
    constructor(id, version, content, createdAt, modifiedAt, isDraft) {
        this.id = id
        this.version = version
        this.content = content
        this.createdAt = createdAt
        this.modifiedAt = modifiedAt
        this.isDraft = isDraft
    }

    static createFromDTO(data) {
        return new TermsAndConditions(
            data.id,
            data.version,
            data.content,
            data.createdAt,
            data.modifiedAt,
            data.isDraft
        )
    }

    asDTO() {
        return {
            id: this.id,
            version: this.version,
            content: this.content,
            createdAt: this.createdAt,
            modifiedAt: this.modifiedAt,
            isDraft: this.isDraft
        }
    }

    setDataFrom(tnc) {
        this.id = tnc.id
        this.version = tnc.version
        this.content = tnc.content
        this.createdAt = tnc.createdAt
        this.modifiedAt = tnc.modifiedAt
        this.isDraft = tnc.isDraft
    }

    copy() {
        let copy = new TermsAndConditions()
        copy.setDataFrom(this)
        return copy
    }

    static validateVersion(version) {
        if (!isString(version)){
            throw new DomainError(Config.errorDomains.tnc, Config.errorCodes.invalidParameter, 'Invalid or missing version')
        }
    }

    static validateContent(content) {
        if (!isString(content)){
            throw new DomainError(Config.errorDomains.tnc, Config.errorCodes.invalidParameter, 'Invalid or missing content')
        }
    }

    static validateId(id) {
        if (!isId(id)){
            throw new DomainError(Config.errorDomains.tnc, Config.errorCodes.invalidParameter, 'Invalid or missing Id')
        }
    }

    static validate() {
        this.validateVersion(this.version)
        this.validateContent(this.content)
        this.validateId(this.id)
    }
}

exports.TermsAndConditions = TermsAndConditions