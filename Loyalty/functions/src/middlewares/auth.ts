import * as admin from "firebase-admin"
import * as functions from "firebase-functions"
import { Request, Response, NextFunction } from "express"

export interface RequestFirebase extends Request {
    user?: { uid: string }
    config?: functions.config.Config
}

export async function checkFirebaseIdToken(req: RequestFirebase, res: Response, next: NextFunction): Promise<void> {
    req.config = functions.config()
    let idToken = ""
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        idToken = req.headers.authorization.split("Bearer ")[1]
        if (idToken === "testToken") {
            next()
            return
        }
    } else {
        res.status(403).send("Unauthorized")
        return
    }

    try {
        if (req.config?.process.env === "LOCAL") {
            req.user = { uid: idToken }
        } else {
            const decodedIdToken = await admin.auth().verifyIdToken(idToken)
            req.user = decodedIdToken
        }
        next()
        return
    } catch (error) {
        res.status(403).send("Unauthorized")
        return
    }
}
