import { genderEnum } from "../../submodules/domain/core/enums"

export const userTestData = {
    testId: "testId",
    extraUserProperties: {
        firstName: "testFirstName",
        email: "testEmail",
        birthday: "testBirthday",
        gender: genderEnum.female,
        nickname: "testNickname",
        lastName: "testLastName",
        phoneNumber: "testPhoneNumber",
        city: "testCity",
    },
}

export const ownerTestData = {
    phoneNumber: "+11123456789",
    testId: "testId",
    testSMSCode: "123456",
    extraOwnerProperties: {},
}
