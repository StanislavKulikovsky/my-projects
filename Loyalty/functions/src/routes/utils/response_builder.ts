import { Response } from "express"
import { DomainError } from "../../../submodules/domain/core/error"
import { isDTOConvertible } from "../../../submodules/domain/core/utils"

export function buildResponse(res: Response, data: ResponseResult): void {
    if (data.data !== undefined) {
        res.json({ data: isDTOConvertible(data.data) ? data.data.asDTO() : data.data })
    } else if ("error" in data && data.error instanceof DomainError) {
        res.status(200).json({ error: data.error })
    } else if ("error" in data && data.error instanceof Error) {
        res.status(500).json({ error: data.error.toString() })
    } else {
        res.status(500).json({ error: "Unknown" })
    }
}
