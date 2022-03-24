import { Owner } from "../../entities/owner"
import { IOwnerGateway } from "../owner_gateway_inteface"

export async function createOwnerProfileInteractor(
    ownerId: string,
    phoneNumber: string,
    ownerGateway: IOwnerGateway,
): Promise<Owner> {
    const owner = new Owner(ownerId, undefined, undefined, phoneNumber)
    const recievedOwner = await ownerGateway.createOwnerProfile(owner)
    return recievedOwner
}
