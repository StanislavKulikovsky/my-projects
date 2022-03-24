import { Config } from "../../core/config"
import { genderEnum } from "../../core/enums"
import { DomainError } from "../../core/error"

/**
 * User entity
 */
export class User {
    id: string
    firstName?: string
    email?: string
    birthday?: number
    gender?: genderEnum
    createdAt?: number
    modifiedAt?: number
    nickname?: string
    lastName?: string
    phoneNumber?: string
    city?: string

    constructor(
        id: string,
        firstName?: string,
        email?: string,
        birthday?: number,
        gender?: genderEnum,
        createdAt?: number,
        modifiedAt?: number,
        nickname?: string,
        lastName?: string,
        phoneNumber?: string,
        city?: string,
    ) {
        this.id = id
        this.firstName = firstName
        this.email = email
        this.birthday = birthday
        this.gender = gender
        this.createdAt = createdAt
        this.modifiedAt = modifiedAt
        this.nickname = nickname
        this.lastName = lastName
        this.phoneNumber = phoneNumber
        this.city = city
    }

    asDTO(): DTO {
        return {
            id: this.id,
            firstName: this.firstName,
            email: this.email,
            birthday: this.birthday,
            gender: this.gender,
            createdAt: this.createdAt,
            modifiedAt: this.modifiedAt,
            nickname: this.nickname,
            lastName: this.lastName,
            phoneNumber: this.phoneNumber,
            city: this.city,
        }
    }

    static createFromDTO(DTO: DTO): User {
        if ("id" in DTO && typeof DTO.id === "string" && DTO.id.length > 0) {
            return new User(
                DTO.id,
                DTO.firstName,
                DTO.email,
                DTO.birthday,
                DTO.gender,
                DTO.createdAt,
                DTO.modifiedAt,
                DTO.nickname,
                DTO.lastName,
                DTO.phoneNumber,
                DTO.city,
            )
        } else {
            throw new DomainError(Config.errorDomains.user, Config.errorCodes.corruptedData, "")
        }
    }
}
