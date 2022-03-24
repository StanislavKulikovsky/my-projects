import { expect } from "chai"
import { describe } from "mocha"
import { Owner } from "../../utils/api_manager"
import { clearDB } from "../../utils/db_test_utils"
import { testCaseSteps } from "../../utils/mocha_utils"
import { ownerTestData } from "../../utils/test_data"
describe("TEST SCENARIO: Create, update owner profile", () => {
    // eslint-disable-next-line   @typescript-eslint/no-explicit-any
    const stepsOutput: { [key: string]: any } = {}

    testCaseSteps(async () => {
        stepsOutput.smsCode = await Owner.smsCode(ownerTestData.phoneNumber)
        stepsOutput.registatedOwner = await Owner.registrateOwner(
            ownerTestData.phoneNumber,
            stepsOutput.smsCode.body.data.smsCode,
        )
        stepsOutput.createdOwner = await Owner.createOwner(ownerTestData.testId, ownerTestData.phoneNumber)
        stepsOutput.ownerForUpdate = Object.assign(
            {},
            stepsOutput.createdOwner.body?.data,
            ownerTestData.extraOwnerProperties,
        )
        stepsOutput.updatedOwner = await Owner.updateOwner(stepsOutput.ownerForUpdate)
        stepsOutput.receivedOwner = await Owner.getOwner(ownerTestData.testId)
    })

    it("Registrated owner should have correct properties", async () => {
        expect(stepsOutput.registatedOwner?.body?.data?.owner?.id).to.be.not.equal(undefined)
        expect(stepsOutput.registatedOwner?.body?.data?.owner?.phoneNumber).to.be.equal(ownerTestData.phoneNumber)
        expect(typeof stepsOutput.registatedOwner?.body?.data?.owner?.modifiedAt).to.be.equal("number")
        expect(typeof stepsOutput.registatedOwner?.body?.data?.owner?.createdAt).to.be.equal("number")
        expect(stepsOutput.registatedOwner?.body?.data?.token).to.be.not.equal(undefined)
    })

    it("Created owner should have correct properties", async () => {
        expect(stepsOutput.createdOwner?.body?.data?.id).to.be.equal(ownerTestData.testId)
        expect(stepsOutput.createdOwner?.body?.data?.phoneNumber).to.be.equal(ownerTestData.phoneNumber)
        expect(typeof stepsOutput.createdOwner?.body?.data?.modifiedAt).to.be.equal("number")
        expect(typeof stepsOutput.createdOwner?.body?.data?.createdAt).to.be.equal("number")
    })

    it("Updated owner should contain correct properties", async () => {
        for (const prop in stepsOutput.ownerForUpdate) {
            if (prop in stepsOutput.updatedOwner?.body?.data) {
                if (prop === "modifiedAt") {
                    expect(stepsOutput.updatedOwner?.body?.data[prop]).not.to.be.equal(stepsOutput.ownerForUpdate[prop])
                } else {
                    expect(stepsOutput.updatedOwner?.body?.data[prop]).to.be.equal(stepsOutput.ownerForUpdate[prop])
                }
            }
        }
    })

    it("Database should contain correct owner profile", async () => {
        for (const prop in stepsOutput.receivedOwner?.body?.data) {
            if (prop in stepsOutput.updatedOwner?.body?.data) {
                expect(stepsOutput.receivedOwner?.body?.data[prop]).to.be.equal(
                    stepsOutput.updatedOwner?.body?.data[prop],
                )
            }
        }
    })

    afterEach(async () => await clearDB())
})
