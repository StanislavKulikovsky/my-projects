import { Owner } from "../../entities/owner"
import { IOwnerGateway } from "../owner_gateway_inteface"

export async function getOwnerProfileByIdInteractor(ownerId: string, ownerGateway: IOwnerGateway): Promise<Owner> {
    return await ownerGateway.getOwnerById(ownerId)
}
