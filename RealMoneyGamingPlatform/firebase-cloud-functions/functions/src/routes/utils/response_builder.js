const { DomainError } = require("../../../submodules/domain/core/error")

function buildResponse(res, data) {
    
    if (data.data !== undefined) {
        res.json({ data: data.data.asDTO !== undefined ? data.data.asDTO() : data.data })
    } else if (data.error instanceof DomainError) {
        res.status(200).json({ error: data.error })
    } else if (data.error !== undefined) {
        console.log(data.error)
        res.status(500).json({ error: data.error.toString() })
    } else {
        res.status(500).json({ error: "Unknown" })
    }

}

exports.buildResponse = buildResponse