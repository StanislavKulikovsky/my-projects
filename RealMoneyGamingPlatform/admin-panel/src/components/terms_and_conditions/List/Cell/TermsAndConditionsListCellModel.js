import React, { useEffect, useState } from "react"
import { Property } from '../../../common/DocumentList/DocumentListCell'
import { releaseTermsAndConditionsInteractor } from '../../../../submodules/domain/terms_and_conditions/interactors/release_tnc'
import { updateTermsAndConditionsActualVersionInteractor } from "../../../../submodules/domain/terms_and_conditions/interactors/update_tnc_actual_version"


export default function useTermsAndConditionsListCellModel(originalTermsAndConditions, setActualTncVersionCallback, actualTncVersionCallback, tncGateway) {
    const [viewData, setViewData] = useState([])
    const [currentTermsAndConditions, setTermsAndConditions] = useState(originalTermsAndConditions)
    const [isActual, setIsActual] = useState()
    const [isEditing, setIsEditing] = useState(false)
    const [errorMessage, setErrorMessage] = useState()

    function createViewDataContent(element) {
        return [
            <Property key={element.id + 'id'} title={'id'} value={element.id}/> ,
            <Property key={element.id + 'version'} title={'version'} value={element.version}/>,
            <Property key={element.id + 'content'} title={'content'} value={element.content.length > 27 ? element.content.slice(0,27) + '...' : element.content}/>,
            <Property key={element.id + 'isDraft'} title={'isDraft'} value={element.isDraft}/>,
            <Property key={element.id + 'createdAt'} title={'createdAt'} value={element.createdAt}/>,
            <Property key={element.id + 'modifiedAt'} title={'modifiedAt'} value={element.modifiedAt}/>
        ]
    }   

    useEffect(()=>{
        setViewData(createViewDataContent(currentTermsAndConditions))
        setIsActual(actualTncVersionCallback === currentTermsAndConditions.version)
    },[currentTermsAndConditions, actualTncVersionCallback])

    function startTermsAndConditionsEditing() {
        setIsEditing(true)
    }

    function viewTermsAndConditions() {
        setIsEditing(true)
    }

    async function applyTermsAndConditions() {
        await updateTermsAndConditionsActualVersionInteractor(currentTermsAndConditions.version, tncGateway)
        setIsActual(true)
        setActualTncVersionCallback(currentTermsAndConditions.version)
    }

    async function releaseTermsAndConditions() {
        setTermsAndConditions(await releaseTermsAndConditionsInteractor(currentTermsAndConditions, tncGateway))
        setActualTncVersionCallback(currentTermsAndConditions.version)
    }

    function finishTermsAndConditionsEditing(savedTermsAndConditions) {
        setIsEditing(false)
        if (savedTermsAndConditions !== undefined) setTermsAndConditions(savedTermsAndConditions)
    }

    return {
        viewData,
        startTermsAndConditionsEditing,
        viewTermsAndConditions,
        applyTermsAndConditions,
        releaseTermsAndConditions,
        isActual,
        isEditing,
        finishTermsAndConditionsEditing,
        currentTermsAndConditions,
        errorMessage,
        setErrorMessage,
    }
}