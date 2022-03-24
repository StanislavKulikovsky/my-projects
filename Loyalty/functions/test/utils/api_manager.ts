import * as superagent from "superagent"

export const User = {
    getUser: async (id: string): Promise<superagent.SuperAgentRequest> => {
        console.log("      - get User")
        return superagent
            .get(`http://localhost:5001/loyaltycard-d2672/us-central1/app/user/${id}`)
            .set({ Authorization: "Bearer " + id })
    },

    createUser: async (id: string): Promise<superagent.SuperAgentRequest> => {
        console.log("      - create User")
        return superagent
            .post(`http://localhost:5001/loyaltycard-d2672/us-central1/app/user/create`)
            .set({ Authorization: "Bearer " + id })
    },

    updateUser: async (user: {
        id: string
        createdAt: number
        modifiedAt: number
    }): Promise<superagent.SuperAgentRequest> => {
        console.log("      - update User")
        return superagent
            .post(`http://localhost:5001/loyaltycard-d2672/us-central1/app/user/update`)
            .send({ user: user })
            .set({ Authorization: "Bearer " + user.id })
    },
}

export const Owner = {
    getOwner: async (id: string): Promise<superagent.SuperAgentRequest> => {
        console.log("      - get Owner")
        return superagent
            .get(`http://localhost:5001/loyaltycard-d2672/us-central1/app/owner/${id}`)
            .set({ Authorization: "Bearer " + id })
    },

    createOwner: async (id: string, phoneNumber: string): Promise<superagent.SuperAgentRequest> => {
        console.log("      - create Owner")
        return superagent
            .post(`http://localhost:5001/loyaltycard-d2672/us-central1/app/owner/create`)
            .send({ phoneNumber: phoneNumber })
            .set({ Authorization: "Bearer " + id })
    },

    updateOwner: async (owner: {
        id: string
        createdAt: number
        modifiedAt: number
    }): Promise<superagent.SuperAgentRequest> => {
        console.log("      - update Owner")
        return superagent
            .post(`http://localhost:5001/loyaltycard-d2672/us-central1/app/owner/update`)
            .send({ owner: owner })
            .set({ Authorization: "Bearer " + owner.id })
    },

    registrateOwner: async (phoneNumber: string, smsCode: string): Promise<superagent.SuperAgentRequest> => {
        console.log("      - register Owner")
        return superagent
            .post(`http://localhost:5001/loyaltycard-d2672/us-central1/app/owner/registrate`)
            .send({ phoneNumber: phoneNumber, smsCode: smsCode })
            .set({ Authorization: "Bearer " + "testToken" })
    },

    smsCode: async (phoneNumber: string): Promise<superagent.SuperAgentRequest> => {
        console.log("      - create sms code")
        return superagent
            .post(`http://localhost:5001/loyaltycard-d2672/us-central1/app/owner/sms`)
            .send({ phoneNumber: phoneNumber })
            .set({ Authorization: "Bearer " + "testToken" })
    },
}
