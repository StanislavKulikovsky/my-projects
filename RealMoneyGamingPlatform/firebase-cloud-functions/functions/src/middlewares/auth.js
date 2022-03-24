'use strict'

const admin = require('firebase-admin')

const validateFirebaseIdToken = async (req, res, next) => {
  if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
    !(req.cookies && req.cookies.__session)) {
    res.status(403).send('Unauthorized')
    return
  }

  let idToken
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    idToken = req.headers.authorization.split('Bearer ')[1]
  } else if (req.cookies) {
    idToken = req.cookies.__session
  } else {
    res.status(403).send('Unauthorized')
    return
  }

  try {
    if (req.config.process.env === "LOCAL") {
      req.user = { uid: idToken }
    } else {
      const decodedIdToken = await admin.auth().verifyIdToken(idToken)
      req.user = decodedIdToken
    }
    next()
    return
  } catch (error) {
    res.status(403).send('Unauthorized')
    return
  }
}

exports.validateFirebaseIdToken = validateFirebaseIdToken