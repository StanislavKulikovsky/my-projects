export async function checkUserNameIsAvailableInteractor(name: string, userGateway: any) {
    return userGateway.nameIsAvailable(name)
}
