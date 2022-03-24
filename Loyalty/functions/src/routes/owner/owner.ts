import * as express from "express"
import { runTransaction, Transaction } from "../../../submodules/domain/firebase/firestore"
import { FirestoreOwnerGateway } from "../../../submodules/domain/firebase/owner/owner_gateway"
import { Owner } from "../../../submodules/domain/owner/entities/owner"
import { createOwnerProfileInteractor } from "../../../submodules/domain/owner/useCase/interactors/create_owner_profile"
import {
    getOwnerProfileByIdInteractor,
} from "../../../submodules/domain/owner/useCase/interactors/get_owner_profile_by_id"
import { updateOwnerProfileInteractor } from "../../../submodules/domain/owner/useCase/interactors/update_owner_profile"
import { RequestFirebase } from "../../middlewares/auth"
import { buildResponse } from "../utils/response_builder"
import { registrateOwnerInteractor } from "../../../submodules/domain/owner/useCase/interactors/registrate_owner"
// eslint-disable-next-line  new-cap
export const router = express.Router()

const testSMSCode = "123456"

router.get("/:ownerId", async (req: RequestFirebase, res) => {
    const result = await runTransaction(async (transaction: Transaction) => {
        return await getOwnerProfileByIdInteractor(req.params.ownerId, new FirestoreOwnerGateway(transaction))
    })

    buildResponse(res, result)
})

router.post("/create", async (req: RequestFirebase, res) => {
    const result = await runTransaction(async (transaction: Transaction) => {
        return await createOwnerProfileInteractor(
            req.user?.uid ? req.user?.uid : "",
            req.body?.phoneNumber,
            new FirestoreOwnerGateway(transaction),
        )
    })

    buildResponse(res, result)
})

router.post("/update", async (req: RequestFirebase, res) => {
    const result = await runTransaction(async (transaction: Transaction) => {
        return await updateOwnerProfileInteractor(
            Owner.createFromDTO(req.body?.owner),
            new FirestoreOwnerGateway(transaction),
        )
    })

    buildResponse(res, result)
})

router.post("/sms", async (req: RequestFirebase, res) => {
    const result = req.body?.phoneNumber ? { data: { smsCode: testSMSCode } } : { error: new Error("Wrong number") }
    buildResponse(res, result)
})

router.post("/registrate", async (req: RequestFirebase, res) => {
    const result = await runTransaction(async (transaction: Transaction) => {
        if (req.body?.smsCode !== testSMSCode) throw new Error("Wrong SMS Code")

        const authData = await registrateOwnerInteractor(req.body?.phoneNumber, new FirestoreOwnerGateway(transaction))

        const owner = await createOwnerProfileInteractor(
            authData.uid,
            req.body?.phoneNumber,
            new FirestoreOwnerGateway(transaction),
        )
        return { owner: owner, token: authData.token }
    })

    buildResponse(res, result)
})
