'use strict'

const functions = require('firebase-functions')
const { createUserProfileInteractor } = require('../../submodules/domain/user/interactors/create_user')
const { runTransaction } = require('../../submodules/domain/firebase/firestore')
const FirebaseUser = require('../../submodules/domain/firebase/user/firebase_user')

exports.createUserProfile = functions.auth.user().onCreate(async (user) => {
    try {
        await runTransaction(async (transaction) => {
            await createUserProfileInteractor(user.uid, new FirebaseUser.UserGateway(transaction))
        })
    } catch (error) {
        console.log(error)
    }
})