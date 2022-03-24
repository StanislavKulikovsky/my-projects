import { Owner } from "../../entities/owner"
import { IOwnerGateway } from "../owner_gateway_inteface"

export async function updateOwnerProfileInteractor(owner: Owner, ownerGateway: IOwnerGateway): Promise<Owner> {
    const recievedOwner = await ownerGateway.updateOwnerProfile(owner)
    return recievedOwner
}
