import { expect } from "chai"
import { describe } from "mocha"
import { User } from "../../utils/api_manager"
import { clearDB } from "../../utils/db_test_utils"
import { testCaseSteps } from "../../utils/mocha_utils"
import { userTestData } from "../../utils/test_data"
describe("TEST SCENARIO: Create, update user profile", () => {
    // eslint-disable-next-line   @typescript-eslint/no-explicit-any
    const stepsOutput: { [key: string]: any } = {}

    testCaseSteps(async () => {
        stepsOutput.createdUser = await User.createUser(userTestData.testId)
        stepsOutput.userForUpdate = Object.assign(
            {},
            stepsOutput.createdUser.body?.data,
            userTestData.extraUserProperties,
        )
        stepsOutput.updatedUser = await User.updateUser(stepsOutput.userForUpdate)
        stepsOutput.receivedUser = await User.getUser(userTestData.testId)
    })

    it("Created user should have correct properties", async () => {
        expect(stepsOutput.createdUser?.body?.data?.id).to.be.equal(userTestData.testId)
        expect(typeof stepsOutput.createdUser?.body?.data?.modifiedAt).to.be.equal("number")
        expect(typeof stepsOutput.createdUser?.body?.data?.createdAt).to.be.equal("number")
    })

    it("Updated user should contain correct properties", async () => {
        for (const prop in stepsOutput.userForUpdate) {
            if (prop in stepsOutput.updatedUser?.body?.data) {
                if (prop === "modifiedAt") {
                    expect(stepsOutput.updatedUser?.body?.data[prop]).not.to.be.equal(stepsOutput.userForUpdate[prop])
                } else {
                    expect(stepsOutput.updatedUser?.body?.data[prop]).to.be.equal(stepsOutput.userForUpdate[prop])
                }
            }
        }
    })

    it("Database should contain correct user profile", async () => {
        for (const prop in stepsOutput.receivedUser?.body?.data) {
            if (prop in stepsOutput.updatedUser?.body?.data) {
                expect(stepsOutput.receivedUser?.body?.data[prop]).to.be.equal(
                    stepsOutput.updatedUser?.body?.data[prop],
                )
            }
        }
    })

    afterEach(async () => await clearDB())
})
