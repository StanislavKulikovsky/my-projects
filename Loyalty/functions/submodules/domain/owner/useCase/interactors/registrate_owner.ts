import { IOwnerGateway } from "../owner_gateway_inteface"

export async function registrateOwnerInteractor(
    phoneNumber: string,
    ownerGateway: IOwnerGateway,
): Promise<{ uid: string; token: string }> {
    const recievedOwner = await ownerGateway.registrateOwner(phoneNumber)
    return recievedOwner
}
