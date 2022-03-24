/**
 * Check if string is an valid email
 * @param {string} email email string
 * @return {boolean} True if email is valid
 */
export function isValidEmail(email: string): boolean {
    const reg = new RegExp(
        "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@" +
            "(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?",
    )
    return reg.test(String(email).toLowerCase())
}

// eslint-disable-next-line  @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export function isDTOConvertible(object: any): object is DTOConvertible {
    return "asDTO" in object && typeof object.asDTO === "function"
}
