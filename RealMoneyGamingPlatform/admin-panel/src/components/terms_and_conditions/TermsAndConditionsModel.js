import { useState } from "react"
import { getTermsAndConditionsActualVersionInteractor } from "../../submodules/domain/terms_and_conditions/interactors/get_tnc_actual_version"

export default function useTermsAndConditionsModel(tncGateway) {
    const [actualTncVersionCallback, setActualTncVersionCallback] = useState()
    getTermsAndConditionsActualVersionInteractor(tncGateway).then(setActualTncVersionCallback)

    return {actualTncVersionCallback, setActualTncVersionCallback}
}