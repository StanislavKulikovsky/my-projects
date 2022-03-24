import * as express from "express"
import { runTransaction, Transaction } from "../../../submodules/domain/firebase/firestore"
import { FirestoreUserGateway } from "../../../submodules/domain/firebase/user/user_gateway"
import { User } from "../../../submodules/domain/user/entities/user"
import { createUserProfileInteractor } from "../../../submodules/domain/user/useCase/interactors/create_user_profile"
import {
    getUserProfileByIdInteractor,
} from "../../../submodules/domain/user/useCase/interactors/get_user_profile_by_id"
import { updateUserProfileInteractor } from "../../../submodules/domain/user/useCase/interactors/update_user_profile"
import { RequestFirebase } from "../../middlewares/auth"
import { buildResponse } from "../utils/response_builder"
// eslint-disable-next-line  new-cap
export const router = express.Router()

router.get("/:userId", async (req: RequestFirebase, res) => {
    const result = await runTransaction(async (transaction: Transaction) => {
        return await getUserProfileByIdInteractor(req.params.userId, new FirestoreUserGateway(transaction))
    })

    buildResponse(res, result)
})

router.post("/create", async (req: RequestFirebase, res) => {
    const result = await runTransaction(async (transaction: Transaction) => {
        return await createUserProfileInteractor(
            req.user?.uid ? req.user?.uid : "",
            new FirestoreUserGateway(transaction),
        )
    })

    buildResponse(res, result)
})

router.post("/update", async (req: RequestFirebase, res) => {
    const result = await runTransaction(async (transaction: Transaction) => {
        return await updateUserProfileInteractor(
            User.createFromDTO(req.body?.user),
            new FirestoreUserGateway(transaction),
        )
    })

    buildResponse(res, result)
})
