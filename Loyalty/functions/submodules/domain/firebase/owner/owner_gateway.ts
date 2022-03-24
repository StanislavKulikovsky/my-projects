import { Config } from "../../core/config"
import { DomainError } from "../../core/error"
import { Owner } from "../../owner/entities/owner"
import { IOwnerGateway } from "../../owner/useCase/owner_gateway_inteface"

import { create, db, getDoc, Transaction, update } from "../firestore"
import * as admin from "firebase-admin"

import { ownerConverter } from "./owner_converter"

export class FirestoreOwnerGateway implements IOwnerGateway {
    transaction?: Transaction

    constructor(transaction?: Transaction) {
        this.transaction = transaction
    }

    async createOwnerProfile(owner: Owner): Promise<Owner> {
        const ownerRef = db.collection("owners").doc(owner.id)
        owner.createdAt = Date.now()
        owner.modifiedAt = Date.now()

        await create(ownerRef, owner, this.transaction, ownerConverter)

        return owner
    }
    async updateOwnerProfile(owner: Owner): Promise<Owner> {
        const ownerRef = db.collection("owners").doc(owner.id)
        owner.modifiedAt = Date.now()

        await update(ownerRef, owner, this.transaction, ownerConverter)

        return owner
    }

    async getOwnerById(ownerId: string): Promise<Owner> {
        const ownerRef = db.collection("owners").doc(ownerId)

        const owner = await getDoc(ownerRef, this.transaction, ownerConverter)
        if (owner instanceof Owner) {
            return owner
        } else {
            throw new DomainError(Config.errorDomains.core, Config.errorCodes.corruptedData, "Corrupted data recieved")
        }
    }

    async registrateOwner(phoneNumber: string): Promise<{ uid: string, token: string }> {
        const userRecord = await admin.auth().createUser({ phoneNumber: phoneNumber })
        const token = await admin.auth().createCustomToken(userRecord.uid)
        return { uid: userRecord.uid, token: token }
    }
}
