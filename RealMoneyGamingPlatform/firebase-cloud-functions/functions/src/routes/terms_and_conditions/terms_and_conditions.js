/* eslint-disable no-loop-func */
'use strict'

const express = require('express')
const router = express.Router()
const { runTransaction } = require('../../../submodules/domain/firebase/firestore')
const { buildResponse } = require('../utils/response_builder')
const { createTermsAndConditionsInteractor } = require('../../../submodules/domain/terms_and_conditions/interactors/create_tnc')
const { getTermsAndConditionsActualVersionInteractor } = require('../../../submodules/domain/terms_and_conditions/interactors/get_tnc_actual_version')
const { loadTermsAndConditionsByVersionInteractor } = require('../../../submodules/domain/terms_and_conditions/interactors/load_tnc_by_version')
const { releaseTermsAndConditionsInteractor } = require('../../../submodules/domain/terms_and_conditions/interactors/release_tnc')
const { updateTermsAndConditionsInteractor } = require('../../../submodules/domain/terms_and_conditions/interactors/update_tnc')
const { updateTermsAndConditionsActualVersionInteractor } = require('../../../submodules/domain/terms_and_conditions/interactors/update_tnc_actual_version')
const { FirestoreTncGateway } = require('../../../submodules/domain/firebase/terms_and_conditions/tnc_gateway')
const { TermsAndConditions } = require('../../../submodules/domain/terms_and_conditions/entities/tnc')

router.post('/create', async (req, res) => {
    let tnc = await runTransaction(async (transaction) => {
        return createTermsAndConditionsInteractor(
            req.body.content,
            req.body.version,
            new FirestoreTncGateway(transaction)
        )
    })

    buildResponse(res, tnc)
})

router.get('/actual_version', async (req, res) => {
    let tncActualVersion = await runTransaction(async (transaction) => {
        return getTermsAndConditionsActualVersionInteractor(
            new FirestoreTncGateway(transaction)
        )
    })

    buildResponse(res, tncActualVersion)
})

router.get('/:version', async (req, res) => {
    let tnc = await runTransaction(async (transaction) => {
        return loadTermsAndConditionsByVersionInteractor(
            req.params.version,
            new FirestoreTncGateway(transaction)
        )
    })

    buildResponse(res, tnc)
})

router.post('/release', async (req, res) => {
    let tnc = await runTransaction(async (transaction) => {
        return releaseTermsAndConditionsInteractor(
            TermsAndConditions.createFromDTO(req.body.tncDTO),
            new FirestoreTncGateway(transaction)
        )
    })

    buildResponse(res, tnc)
})

router.post('/update', async (req, res) => {
    let tnc = await runTransaction(async (transaction) => {
        return updateTermsAndConditionsInteractor(
            TermsAndConditions.createFromDTO(req.body.tncDTO),
            new FirestoreTncGateway(transaction)
        )
    })

    buildResponse(res, tnc)
})

router.post('/actual_version/update', async (req, res) => {
    let version = await runTransaction(async (transaction) => {
        return updateTermsAndConditionsActualVersionInteractor(
            req.body.version,
            new FirestoreTncGateway(transaction)
        )
    })

    buildResponse(res, version)
})

exports.router = router