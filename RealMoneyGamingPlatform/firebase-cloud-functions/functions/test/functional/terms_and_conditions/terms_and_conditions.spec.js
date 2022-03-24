const DBUtils = require('../../utils/db_test_utils')
const { expect } = require("chai")
const { describe } = require("mocha")
const TestData = require('../../utils/test_data')
const APIManager = require('../../utils/api_manager')
const { testCaseSteps } = require('../../utils/mocha_utils')

describe('TEST SCENARIO: Create, update T&C', () => {
    let stepsOutput = {}

    testCaseSteps(async () => {

        const user0 = TestData.user1()

        DBUtils.configsRef.doc('terms_and_conditions').set({version: null})

        stepsOutput.userAfterCreation = (await APIManager.User.createUser(user0)).body.data
        stepsOutput.tnc000draft = (await APIManager.Tnc.createTnc(stepsOutput.userAfterCreation, TestData.testContent1, TestData.testVersion1)).body.data
        const tncForUpdate = {...stepsOutput.tnc000draft, content: TestData.testContent2}
        stepsOutput.tnc000updated = (await APIManager.Tnc.updateTnc(stepsOutput.userAfterCreation, tncForUpdate)).body.data
        stepsOutput.tnc000released = (await APIManager.Tnc.releaseTnc(stepsOutput.userAfterCreation, stepsOutput.tnc000updated)).body.data
        stepsOutput.tncActualVersionAfter000release = (await APIManager.Tnc.getTncActualVersion(stepsOutput.userAfterCreation)).body.data
        stepsOutput.tnc012draft = (await APIManager.Tnc.createTnc(stepsOutput.userAfterCreation, TestData.testContent2, TestData.testVersion2)).body.data
        stepsOutput.tnc012released = (await APIManager.Tnc.releaseTnc(stepsOutput.userAfterCreation, stepsOutput.tnc012draft)).body.data
        stepsOutput.tncActualVersionAfter012release = (await APIManager.Tnc.getTncActualVersion(stepsOutput.userAfterCreation)).body.data
        stepsOutput.tncActualVersionAfterManualChange = (await APIManager.Tnc.updateTncActualVersion(stepsOutput.userAfterCreation, TestData.testVersion1)).body.data
        stepsOutput.alreadyExistedVersionTncError = (await APIManager.Tnc.createTnc(stepsOutput.userAfterCreation, TestData.testVersion1, TestData.testVersion1)).body.error
        stepsOutput.userAfterTncVersionUpdate = (await APIManager.User.updateUserTncVersion(stepsOutput.userAfterCreation, stepsOutput.tncActualVersionAfterManualChange)).body.data
        stepsOutput.allTncs = (await APIManager.Tnc.loadTncs(stepsOutput.userAfterTncVersionUpdate)).body.data
        stepsOutput.tnc000byVersion = (await APIManager.Tnc.loadTncByVersion(stepsOutput.userAfterTncVersionUpdate, TestData.testVersion1)).body.data
        stepsOutput.tnc012byVersion = (await APIManager.Tnc.loadTncByVersion(stepsOutput.userAfterTncVersionUpdate, TestData.testVersion2)).body.data
        console.log(stepsOutput.allTncs[0].version)
        console.log(stepsOutput.allTncs[1].version)
        console.log(stepsOutput.tnc000byVersion.version)
        console.log(stepsOutput.tnc012byVersion.version)

        DBUtils.configsRef.doc('terms_and_conditions').delete()
    })

    it('Created user should have null tncVersion', async () => {
        expect(stepsOutput.userAfterCreation.tncVersion).to.be.equal(null)
    })

    it('New T&C is created succesfully', async () => {
        expect(stepsOutput.tnc000draft.version).to.be.equal(TestData.testVersion1)
        expect(stepsOutput.tnc000draft.content).to.be.equal(TestData.testContent1)
        expect(stepsOutput.tnc000draft.isDraft).to.be.equal(true)
    })

    it('T&C is updated succesfully', async () => {
        expect(stepsOutput.tnc000updated.version).to.be.equal(TestData.testVersion1)
        expect(stepsOutput.tnc000updated.content).to.be.equal(TestData.testContent2)
        expect(stepsOutput.tnc000updated.isDraft).to.be.equal(true)
    })

    it('T&C is released succesfully', async () => {
        expect(stepsOutput.tnc000released.version).to.be.equal(TestData.testVersion1)
        expect(stepsOutput.tnc000released.content).to.be.equal(TestData.testContent2)
        expect(stepsOutput.tnc000released.isDraft).to.be.equal(false)
    })

    it('T&C actual version is correct after releases', async () => {
        expect(stepsOutput.tncActualVersionAfter000release).to.be.equal(TestData.testVersion1)
        expect(stepsOutput.tncActualVersionAfter012release).to.be.equal(TestData.testVersion2)
    })

    it('T&C actual version is correct after manual update', async () => {
        expect(stepsOutput.tncActualVersionAfterManualChange).to.be.equal(TestData.testVersion1)
    })

    it('User tncVersion is updated succesfully', async () => {
        expect(stepsOutput.userAfterTncVersionUpdate.tncVersion).to.be.equal(TestData.testVersion1)
    })

    it('Should return right message if trying to create already existing version', async () => {
        expect(stepsOutput.alreadyExistedVersionTncError.message).to.be.equal('This version already exists')
    })

    it('DB should contain right T&C\'s', async () => {
        expect(stepsOutput.allTncs[0].version).to.be.equal(TestData.testVersion2)
        expect(stepsOutput.allTncs[0].content).to.be.equal(TestData.testContent2)
        expect(stepsOutput.allTncs[1].version).to.be.equal(TestData.testVersion1)
        expect(stepsOutput.allTncs[1].content).to.be.equal(TestData.testContent2)
        expect(stepsOutput.tnc000byVersion.version).to.be.equal(TestData.testVersion1)
        expect(stepsOutput.tnc000byVersion.content).to.be.equal(TestData.testContent2)
        expect(stepsOutput.tnc012byVersion.version).to.be.equal(TestData.testVersion2)
        expect(stepsOutput.tnc012byVersion.content).to.be.equal(TestData.testContent2)
    })
})

afterEach(async () => {
    await DBUtils.clearDB()
})
