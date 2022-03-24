import { Config } from "../../core/config"
import { DomainError } from "../../core/error"

export class Owner {
    id: string
    createdAt?: number
    modifiedAt?: number
    phoneNumber?: string

    constructor(id: string, createdAt?: number, modifiedAt?: number, phoneNumber?: string) {
        this.id = id
        this.createdAt = createdAt
        this.modifiedAt = modifiedAt
        this.phoneNumber = phoneNumber
    }

    asDTO(): DTO {
        return {
            id: this.id,
            createdAt: this.createdAt,
            modifiedAt: this.modifiedAt,
            phoneNumber: this.phoneNumber,
        }
    }

    static createFromDTO(DTO: DTO): Owner {
        if ("id" in DTO && typeof DTO.id === "string" && DTO.id.length > 0) {
            return new Owner(DTO.id, DTO.createdAt, DTO.modifiedAt, DTO.phoneNumber)
        } else {
            throw new DomainError(Config.errorDomains.owner, Config.errorCodes.corruptedData, "")
        }
    }
}
