import { Config } from "../../core/config"
import { DomainError } from "../../core/error"
import { User } from "../../user/entities/user"
import { IUserGateway } from "../../user/useCase/user_gateway_inteface"

import { create, db, getDoc, Transaction, update } from "../firestore"
import { userConverter } from "./user_converter"

export class FirestoreUserGateway implements IUserGateway {
    transaction?: Transaction

    constructor(transaction?: Transaction) {
        this.transaction = transaction
    }

    async createUserProfile(user: User): Promise<User> {
        const userRef = db.collection("users").doc(user.id)
        user.createdAt = Date.now()
        user.modifiedAt = Date.now()

        await create(userRef, user, this.transaction, userConverter)

        return user
    }
    async updateUserProfile(user: User): Promise<User> {
        const userRef = db.collection("users").doc(user.id)
        user.modifiedAt = Date.now()

        await update(userRef, user, this.transaction, userConverter)

        return user
    }

    async getUserById(userId: string): Promise<User> {
        const userRef = db.collection("users").doc(userId)

        const user = await getDoc(userRef, this.transaction, userConverter)
        if (user instanceof User) {
            return user
        } else {
            throw new DomainError(Config.errorDomains.core, Config.errorCodes.corruptedData, "Corrupted data recieved")
        }
    }
}
