/**
 * Error object that provide domain code, error code and error message
 */
export class DomainError {
    domain: string
    code: number
    message: string

    /**
     *
     * @param {string} domain domain code
     * @param {number} code numeric error code
     * @param {string} message text, message
     */
    constructor(domain: string, code: number, message: string) {
        this.domain = domain
        this.code = code
        this.message = message
    }

    toString(): string {
        return `Error:\n   Domain: ${this.domain}\n   Code: ${this.code}\n   Message: ${this.message}`
    }
}
