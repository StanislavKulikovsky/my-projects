const DBUtils = require('../../utils/db_test_utils')
const { expect } = require("chai")
const { describe } = require("mocha")
const TestData = require('../../utils/test_data')
const APIManager = require('../../utils/api_manager')
const { testCaseSteps } = require('../../utils/mocha_utils')

describe('TEST SCENARIO: Create, delete user avatar', () => {
    let stepsOutput = {}

    testCaseSteps(async () => {

        const user0 = TestData.user0()
        const urlCheckString = `https://storage.googleapis.com/sciencerules-e97cd.appspot.com/${user0.id}/avatar?GoogleAccessId=firebase-adminsdk-wh6vn%40sciencerules-e97cd.iam.gserviceaccount.com`

        stepsOutput.userAfterCreation = (await APIManager.User.createUser(user0)).body.data
        stepsOutput.userAfterAvatarUploaded = (await APIManager.User.uploadUserAvatar(user0, TestData.base64AvatarString)).body.data
        stepsOutput.isFileExistInStorageAfterUpdate = (await DBUtils.storage.bucket().file(`${user0.id}/avatar`).exists())[0]
        stepsOutput.isUserContainCorrectAvatarURL = stepsOutput.userAfterAvatarUploaded.avatarURL.includes(urlCheckString)
        stepsOutput.userAfterAvatarDeleted = (await APIManager.User.deleteUserAvatar(user0)).body.data
        stepsOutput.isFileExistInStorageAfterDelete = (await DBUtils.storage.bucket().file(`${user0.id}/avatar`).exists())[0]
        stepsOutput.errorAfterWrongFormatUploading = (await APIManager.User.uploadUserAvatar(user0, TestData.wrongFormatBase64AvatarString)).body.error
        stepsOutput.errorAfterBigFileUploading = (await APIManager.User.uploadUserAvatar(user0, TestData.base64BigFilesString)).body.error
    })

    it('Created user should have null avatar URL', async () => {
        expect(stepsOutput.userAfterCreation.avatarURL).to.be.equal(null)
    })

    it('Uploaded file should exist is storage', async () => {
        expect(stepsOutput.isFileExistInStorageAfterUpdate).to.be.equal(true)
    })

    it('Updated user should contain correct avatar URL after avatar uploaded', async () => {
        expect(stepsOutput.isUserContainCorrectAvatarURL).to.be.equal(true)
    })

    it('Deleted file should not exist is storage', async () => {
        expect(stepsOutput.isFileExistInStorageAfterDelete).to.be.equal(false)
    })

    it('Updated user should contain null avatar URL after avatar deleted', async () => {
        expect(stepsOutput.userAfterAvatarDeleted.avatarURL).to.be.equal(null)
    })

    it('Error of wrong format must have right message', async () => {
        expect(stepsOutput.errorAfterWrongFormatUploading.message).to.be.equal('Invalid uploading file type')
    })

    it('Error of too big file must have right message', async () => {
        expect(stepsOutput.errorAfterBigFileUploading.message).to.be.equal('Maximum file size is 1MB')
    })

    afterEach(async () => {
        await DBUtils.clearDB()
    })
})
