import { before } from "mocha"

export function testCaseSteps(steps: () => Promise<void>): void {
    before(async () => {
        console.log("    STEPS:")
        await steps()
        console.log("    EXPECTED RESULTS:")
    })
}
