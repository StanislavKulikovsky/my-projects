import { useRef, useState } from "react"
import { TermsAndConditions } from "../../../submodules/domain/terms_and_conditions/entities/tnc"
import { createTermsAndConditionsInteractor } from "../../../submodules/domain/terms_and_conditions/interactors/create_tnc"
import { updateTermsAndConditionsInteractor } from "../../../submodules/domain/terms_and_conditions/interactors/update_tnc"

export default function useTermsAndConditionsDetailsModel(tnc, tncGateway) {
    const draftTermsAndConditions = useRef(tnc.copy())
    const [isLoading, setIsLoading] = useState(false)

    async function saveChanges() {
        if (isLoading) { return }

        setIsLoading(true)

        try {
            if (tnc.id !== null && tnc.id !== undefined) {
                draftTermsAndConditions.current = await updateTermsAndConditionsInteractor(draftTermsAndConditions.current, tncGateway)
            } else {
                TermsAndConditions.validateContent(draftTermsAndConditions.current.content)
                TermsAndConditions.validateVersion(draftTermsAndConditions.current.version)
                draftTermsAndConditions.current = await createTermsAndConditionsInteractor(draftTermsAndConditions.current.content, draftTermsAndConditions.current.version, tncGateway)
            }
            tnc.setDataFrom(draftTermsAndConditions.current)
        } catch (error) {
            throw error
        } finally {
            setIsLoading(false)
        }

        return draftTermsAndConditions.current
    }

    function updateTncVersion(version) {
        draftTermsAndConditions.current.version = version
    }

    function updateTncContent(content) {
        draftTermsAndConditions.current.content = content
    }

    return { draftTermsAndConditions: draftTermsAndConditions.current, updateTncVersion, updateTncContent, saveChanges, isLoading}
}