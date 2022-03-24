import { Transaction } from "../../firebase/firestore"
import { Owner } from "../entities/owner"

export interface IOwnerGateway {
    transaction?: Transaction

    createOwnerProfile(owner: Owner): Promise<Owner>
    updateOwnerProfile(owner: Owner): Promise<Owner>
    getOwnerById(ownerId: string): Promise<Owner>
    registrateOwner(phoneNumber: string): Promise<{ uid: string; token: string }>
}
