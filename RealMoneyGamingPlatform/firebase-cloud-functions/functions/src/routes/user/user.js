/* eslint-disable no-loop-func */
'use strict'

const express = require('express')
const router = express.Router()
const { runTransaction } = require('../../../submodules/domain/firebase/firestore')
const { buildResponse } = require('../utils/response_builder')
const { createUserProfileInteractor } = require('../../../submodules/domain/user/interactors/create_user')
const { updateUserAvatarInteractor } = require('../../../submodules/domain/user/interactors/update_user_avatar')
const { deleteUserAvatarInteractor } = require('../../../submodules/domain/user/interactors/delete_user_avatar')
const { updateUserTncVersionInteractor } = require('../../../submodules/domain/user/interactors/update_user_tnc_version')
const { FirestoreUserGateway } = require('../../../submodules/domain/firebase/user/user_gateway')
const { User } = require('../../../submodules/domain/user/entities/user')

router.post('/create', async (req, res) => {
    let user = await runTransaction(async (transaction) => {
        return createUserProfileInteractor(
            req.user.uid,
            new FirestoreUserGateway(transaction)
        )
    })

    buildResponse(res, user)
})

router.post('/avatar/update/:userId', async (req, res) => {
    let downloadURL = await runTransaction(async (transaction) => {
        return updateUserAvatarInteractor(
            req.body.base64String,
            req.params.userId,
            new FirestoreUserGateway(transaction)
        )
    })

    buildResponse(res, downloadURL)
})

router.post('/tnc_version/update/:userId', async (req, res) => {
    let downloadURL = await runTransaction(async (transaction) => {
        return updateUserTncVersionInteractor(
            User.createFromDTO(req.body.user),
            req.body.version,
            new FirestoreUserGateway(transaction)
        )
    })

    buildResponse(res, downloadURL)
})

router.delete('/avatar/:userId', async (req, res) => {
    let user = await runTransaction(async (transaction) => {
        return deleteUserAvatarInteractor(
            req.params.userId,
            new FirestoreUserGateway(transaction)
        )
    })

    buildResponse(res, user)
})

exports.router = router